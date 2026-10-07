import math

DEHRADUN_CENTER_LAT = 30.3165
DEHRADUN_CENTER_LNG = 78.0322

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth in meters."""
    R = 6371000  # Radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return R * c

def get_dehradun_zone(lat: float, lng: float) -> str:
    """Classify coordinates into regional Dehradun municipal zones."""
    if lat > 30.34:
        return "North"
    elif lat < 30.28:
        return "South"
    elif lng > 78.06:
        return "East"
    elif lng < 78.00:
        return "West"
    elif lat < 30.31 and lng > 78.04:
        return "South-East"
    return "Central"
