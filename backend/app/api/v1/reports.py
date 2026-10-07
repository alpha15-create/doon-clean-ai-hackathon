import json
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, Request, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.dependencies import get_current_user, get_optional_current_user, require_admin
from app.models.user import User
from app.models.report import Report
from app.crud.reports import (
    get_reports,
    get_report_by_id,
    get_user_reports,
    create_report,
    update_report_status,
    update_report_priority,
    assign_report_team,
)
from app.crud.waste import create_waste_analysis
from app.services.report_service import report_service
from app.services.storage_service import storage_service
from app.services.image_service import image_service
from app.services.duplicate_service import duplicate_service
from app.services.priority_service import priority_service
from app.services.notification_service import notification_service
from app.ai.waste_detector import waste_detector
from app.utils.helpers import api_response, api_error_response, generate_report_code
from app.utils.geo import get_dehradun_zone
from app.schemas.report import ReportStatusUpdateRequest, ReportPriorityUpdateRequest

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("")
def list_reports(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    wasteType: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    reports = get_reports(db, status=status, priority=priority, waste_type=wasteType, search=search)
    formatted = [report_service.format_report_response(r) for r in reports]
    return api_response(formatted)

@router.get("/my")
def get_my_reports(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    if user_id:
        reports = get_user_reports(db, user_id)
        if reports:
            return api_response([report_service.format_report_response(r) for r in reports])
    
    # Return all reports as friendly fallback for demo
    all_reports = get_reports(db, limit=20)
    return api_response([report_service.format_report_response(r) for r in all_reports])

@router.get("/{id}")
def get_single_report(id: str, db: Session = Depends(get_db)):
    report = get_report_by_id(db, id)
    if not report:
        return api_error_response(f"Report '{id}' not found", code="NOT_FOUND")
    return api_response(report_service.format_report_response(report))

@router.post("")
async def create_new_report(
    request: Request,
    image: Optional[UploadFile] = File(None),
    description: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    landmark: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    report_code = generate_report_code()
    image_url = "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80"
    storage_path = None
    title = "Waste Incident"
    waste_type = "Plastic Waste"
    ai_conf = 92
    severity = "High"
    est_qty = "Medium (~60 kg)"
    prio_score = 80
    lat = 30.3244
    lng = 78.0418
    desc = "Reported via DoonClean AI citizen portal."
    landm = "Clock Tower"
    addr = "Clock Tower North, Dehradun"
    zone = "Central"
    user_id = current_user.id if current_user else None

    # Check if request is JSON body
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            title = body.get("title") or title
            desc = body.get("description") or desc
            image_url = body.get("imageUrl") or image_url
            waste_type = body.get("wasteType") or waste_type
            ai_conf = int(body.get("aiConfidence", 92))
            severity = body.get("severity") or severity
            est_qty = body.get("estimatedQuantity") or est_qty
            prio_score = int(body.get("priorityScore", 80))

            loc = body.get("location") or {}
            lat = float(loc.get("lat", lat))
            lng = float(loc.get("lng", lng))
            landm = loc.get("landmark") or landm
            addr = loc.get("address") or addr
            zone = loc.get("zone") or get_dehradun_zone(lat, lng)

            citizen_data = body.get("citizen") or {}
            if citizen_data.get("id") and not user_id:
                user_id = citizen_data.get("id")
        except Exception as e:
            print(f"[Reports] Error parsing JSON body: {e}")
    elif image:
        # Multipart form data with file
        raw_bytes = await image.read()
        processed_bytes, _, _ = image_service.inspect_and_compress(raw_bytes)
        uploaded_url, s_path = await storage_service.upload_image(
            processed_bytes, image.filename or "waste.jpg", image.content_type, report_code
        )
        image_url = uploaded_url
        storage_path = s_path

        if description:
            desc = description
        if latitude is not None:
            lat = float(latitude)
        if longitude is not None:
            lng = float(longitude)
        if landmark:
            landm = landmark
        if address:
            addr = address
        zone = get_dehradun_zone(lat, lng)

        # Run AI detection on uploaded image
        ai_result = waste_detector.analyze_image(processed_bytes, image.filename or "")
        waste_type = ai_result.get("wasteType", waste_type)
        ai_conf = int(ai_result.get("confidence", ai_conf))
        severity = ai_result.get("severity", severity)
        est_qty = ai_result.get("estimatedQuantity", est_qty)
        prio_score = int(ai_result.get("priorityScore", prio_score))
        title = f"{waste_type} near {landm}"

    # Check for duplicate
    is_dup, dup_count, _ = duplicate_service.check_duplicate(db, lat, lng, waste_type)

    # Recalculate priority with spatial factors
    tier, final_prio_score = priority_service.calculate_priority(
        waste_type=waste_type,
        severity=severity,
        estimated_quantity=est_qty,
        duplicate_count=dup_count,
        zone=zone
    )
    severity = tier
    prio_score = final_prio_score

    report_record = create_report(db, {
        "report_code": report_code,
        "user_id": user_id,
        "title": title or f"{waste_type} at {landm}",
        "description": desc,
        "image_url": image_url,
        "storage_path": storage_path,
        "latitude": lat,
        "longitude": lng,
        "landmark": landm,
        "address": addr,
        "zone": zone,
        "status": "Reported",
        "waste_type": waste_type,
        "ai_confidence": ai_conf,
        "severity": severity,
        "estimated_quantity": est_qty,
        "priority_score": prio_score,
        "is_duplicate": is_dup,
        "duplicate_count": dup_count,
    })

    # Save AI analysis
    create_waste_analysis(db, report_record.id, {
        "wasteType": waste_type,
        "confidence": ai_conf,
        "severity": severity,
        "estimatedQuantity": est_qty,
        "priorityScore": prio_score,
        "detectedItems": [waste_type, "Surface litter", "Urban debris"],
        "recommendation": f"Dispatched for {waste_type} municipal sorting in {zone} zone."
    })

    # Create notification
    notification_service.create_notification(
        db,
        title="Waste Report Submitted",
        message=f"Complaint {report_code} recorded near {landm}. AI Priority: {prio_score}/100.",
        notif_type="success",
        user_id=user_id,
        report_id=report_record.id
    )

    return api_response(report_service.format_report_response(report_record), message="Report created successfully")

@router.put("/{id}/status")
def update_status(id: str, payload: ReportStatusUpdateRequest, db: Session = Depends(get_db)):
    report = get_report_by_id(db, id)
    if not report:
        return api_error_response(f"Report '{id}' not found", code="NOT_FOUND")

    updated = update_report_status(db, report, payload.status, payload.note or "")

    notification_service.create_notification(
        db,
        title=f"Report Status: {payload.status}",
        message=f"Report {report.report_code} status updated to {payload.status}. {payload.note or ''}",
        notif_type="info",
        user_id=report.user_id,
        report_id=report.id
    )

    return api_response(report_service.format_report_response(updated), message="Status updated successfully")

@router.put("/{id}")
async def update_report(id: str, request: Request, db: Session = Depends(get_db)):
    report = get_report_by_id(db, id)
    if not report:
        return api_error_response(f"Report '{id}' not found", code="NOT_FOUND")

    try:
        body = await request.json()
        if "severity" in body or "priorityScore" in body:
            sev = body.get("severity", report.severity)
            score = int(body.get("priorityScore", report.priority_score))
            report = update_report_priority(db, report, sev, score)
        if "status" in body:
            report = update_report_status(db, report, body.get("status"), body.get("note", ""))
        if "teamId" in body:
            report = assign_report_team(db, report, body.get("teamId"))
    except Exception as e:
        print(f"[Reports] Error updating report: {e}")

    return api_response(report_service.format_report_response(report), message="Report updated successfully")
