"""
CrowdShield AI — Application Entry Point
Run with:  python app.py
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "backend.api:app",
        host="0.0.0.0",   # Listen on all interfaces — reachable on LAN
        port=8000,
        reload=False,
        log_level="info",
    )
