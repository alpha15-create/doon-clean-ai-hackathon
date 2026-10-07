from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.notification import Notification

class NotificationService:
    @staticmethod
    def create_notification(
        db: Session,
        title: str,
        message: str,
        notif_type: str = "info",
        user_id: Optional[str] = None,
        report_id: Optional[str] = None
    ) -> Notification:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type,
            report_id=report_id
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)
        return notif

    @staticmethod
    def get_notifications(db: Session, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        query = db.query(Notification)
        if user_id:
            query = query.filter((Notification.user_id == user_id) | (Notification.user_id == None))
        
        notifs = query.order_by(Notification.created_at.desc()).limit(20).all()
        return [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "time": n.created_at.strftime("%I:%M %p") if n.created_at else "Just now",
                "type": n.type,
                "read": n.is_read
            }
            for n in notifs
        ]

notification_service = NotificationService()
