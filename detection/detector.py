from ultralytics import YOLO
from pathlib import Path

# =====================================================
# Project Paths
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "yolov8n.pt"


class PersonDetector:
    def __init__(self):
        print("Loading YOLO Model...")
        self.model = YOLO(str(MODEL_PATH))
        print("YOLO Model Loaded Successfully!")

    def detect(self, frame):
        return self.model(frame, verbose=False)

    def track(self, frame):
        return self.model.track(
            frame,
            persist=True,
            classes=[0],      # Track only persons
            imgsz=960,         # Faster inference
            conf=0.20,
            iou=0.5,
            tracker="bytetrack.yaml",
            verbose=False
        )