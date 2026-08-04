from ultralytics import YOLO
import cv2
from pathlib import Path

# =====================================================
# Project Paths
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "yolov8m.pt"
VIDEO_PATH = BASE_DIR / "datasets" / "videos" / "crowd1.mp4"

OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_VIDEO = OUTPUT_DIR / "detected_people.mp4"

# =====================================================
# Load YOLO Model
# =====================================================

model = YOLO(str(MODEL_PATH))

# =====================================================
# Open Video
# =====================================================

cap = cv2.VideoCapture(str(VIDEO_PATH))

if not cap.isOpened():
    print("❌ Error: Could not open video.")
    print("Video Path:", VIDEO_PATH)
    exit()

# =====================================================
# Video Properties
# =====================================================

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

writer = cv2.VideoWriter(
    str(OUTPUT_VIDEO),
    cv2.VideoWriter_fourcc(*"mp4v"),
    fps,
    (width, height)
)

print("✅ Processing Video...")

# =====================================================
# Detection Loop
# =====================================================

while True:

    ret, frame = cap.read()

    if not ret:
        break

    results = model(frame)

    people_count = 0

    for result in results:

        for box in result.boxes:

            cls = int(box.cls[0])

            # COCO Person Class = 0
            if cls == 0:

                people_count += 1

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    2
                )

    cv2.putText(
        frame,
        f"People: {people_count}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2
    )

    writer.write(frame)

    cv2.imshow("CrowdShield AI", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# =====================================================
# Cleanup
# =====================================================

cap.release()
writer.release()
cv2.destroyAllWindows()

print("\n✅ Detection Complete!")
print("Saved to:", OUTPUT_VIDEO)