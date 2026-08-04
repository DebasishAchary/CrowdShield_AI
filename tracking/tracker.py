from pathlib import Path
import cv2

from detection.detector import PersonDetector
from analytics.density import CrowdDensity
from prediction.risk_engine import RiskEngine

# =====================================================
# Project Paths
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent
VIDEO = BASE_DIR / "datasets" / "videos" / "crowd1.mp4"

print("=" * 60)
print("CrowdShield AI - Tracking & Risk Detection")
print("=" * 60)

# =====================================================
# Initialize Modules
# =====================================================

detector = PersonDetector()
density = CrowdDensity()
risk_engine = RiskEngine()

# =====================================================
# Open Video
# =====================================================

cap = cv2.VideoCapture(str(VIDEO))

if not cap.isOpened():
    print("❌ Failed to open video.")
    exit()

frame_count = 0

while True:

    ret, frame = cap.read()

    if not ret:
        break

    frame_count += 1

    # Resize for faster inference
    frame = cv2.resize(frame, (1280, 720))

    density.reset()

    # ===========================
    # Person Tracking
    # ===========================

    results = detector.track(frame)

    annotated = frame.copy()

    boxes = results[0].boxes

    if boxes.id is not None:

        for box in boxes:

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            track_id = int(box.id[0])

            # Bounding Box
            cv2.rectangle(
                annotated,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            # ID
            cv2.putText(
                annotated,
                f"ID:{track_id}",
                (x1, y1 - 8),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2
            )

            # Center Point
            center_x = (x1 + x2) // 2
            center_y = (y1 + y2) // 2

            cv2.circle(
                annotated,
                (center_x, center_y),
                4,
                (0, 0, 255),
                -1
            )

            density.update(
                center_x,
                center_y,
                frame.shape[1],
                frame.shape[0]
            )

    # =====================================================
    # Density Analysis
    # =====================================================

    zones = density.get_counts()

    risk = risk_engine.evaluate(zones)

    h, w = annotated.shape[:2]

    # =====================================================
    # Zone Lines
    # =====================================================

    cv2.line(
        annotated,
        (w // 2, 0),
        (w // 2, h),
        (0, 255, 255),
        4
    )

    cv2.line(
        annotated,
        (0, h // 2),
        (w, h // 2),
        (0, 255, 255),
        4
    )

    # =====================================================
    # Zone Counts
    # =====================================================

    cv2.putText(annotated, f"A : {zones['A']}", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

    cv2.putText(annotated, f"B : {zones['B']}", (w-140, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

    cv2.putText(annotated, f"C : {zones['C']}", (20, h-20),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

    cv2.putText(annotated, f"D : {zones['D']}", (w-140, h-20),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

    # =====================================================
    # Dashboard
    # =====================================================

    total_people = sum(zones.values())

    cv2.rectangle(
        annotated,
        (10, 60),
        (430, 270),
        (40, 40, 40),
        -1
    )

    cv2.putText(
        annotated,
        f"People : {total_people}",
        (25,95),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.9,
        (255,255,255),
        2
    )

    cv2.putText(
        annotated,
        f"Risk : {risk['risk']}",
        (25,135),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.9,
        risk["color"],
        2
    )

    cv2.putText(
        annotated,
        f"Reason : {risk['reason']}",
        (25,175),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255,255,255),
        2
    )

    cv2.putText(
        annotated,
        "Recommendation:",
        (25,215),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0,255,255),
        2
    )

    cv2.putText(
        annotated,
        risk["recommendation"],
        (25,245),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (255,255,255),
        2
    )

    # =====================================================
    # Display
    # =====================================================

    cv2.imshow("CrowdShield AI", annotated)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

print(f"\nProcessed {frame_count} frames successfully.")