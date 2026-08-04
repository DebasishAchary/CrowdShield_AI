from fastapi import FastAPI
from backend.state import latest_data

app = FastAPI(title="CrowdShield AI API")


@app.get("/")
def root():
    return {
        "message": "CrowdShield AI Backend Running"
    }


@app.get("/status")
def status():
    return latest_data


@app.get("/risk")
def risk():
    return {
        "risk": latest_data["risk"],
        "people": latest_data["people"],
        "highest_zone": latest_data["highest_zone"]
    }


@app.get("/flow")
def flow():
    return latest_data["flow"]


@app.get("/zones")
def zones():
    return latest_data["zones"]


@app.get("/recommendations")
def recommendations():
    return latest_data["recommendations"]


@app.get("/bottleneck")
def bottleneck():
    return latest_data["bottleneck"]