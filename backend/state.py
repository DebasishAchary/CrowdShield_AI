from threading import Lock

latest_data = {
    "people": 0,
    "risk": "LOW",
    "highest_zone": "A",
    "zones": {
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 0,
    },
    "flow": {
        "UP": 0,
        "DOWN": 0,
        "LEFT": 0,
        "RIGHT": 0,
        "STATIONARY": 0,
    },
    "recommendations": [],
    "bottleneck": {
        "bottleneck": False,
        "zone": None,
        "reason": "",
    },
}

latest_frame = None

frame_lock = Lock()