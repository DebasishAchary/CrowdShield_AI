from pathlib import Path
import cv2

from detection.detector import PersonDetector
from analytics.density import CrowdDensity
from prediction.risk_engine import RiskEngine
from recommendation.recommender import RecommendationEngine

# =====================================================
# Project Paths
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent
VIDEO = BASE_DIR / "datasets" / "videos" / "crowd1.mp4"

print("=" * 60)
print("CrowdShield AI - Tracking & AI Decision Support")
print("=" * 60)

# =====================================================
# Initialize Modules
# =====================================================

detector = PersonDetector()
density = CrowdDensity()
risk_engine = RiskEngine()
recommender = RecommendationEngine()

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

    # Resize for faster processing
    frame = cv2.resize(frame, (1280, 720))

    annotated = frame.copy()

    density.reset()

    # =====================================================
    # Person Tracking
    # =====================================================

    results = detector.track(frame)

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

            # Tracking ID
            cv2.putText(
                annotated,
                f"ID:{track_id}",
                (x1, y1 - 8),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2
            )

            # Person Center
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
    # Crowd Density Analysis
    # =====================================================

    zones = density.get_counts()

    risk = risk_engine.evaluate(zones)

    recommendation = recommender.generate(risk)

    total_people = risk["total_people"]

    h, w = annotated.shape[:2]

    # =====================================================
    # Draw Zone Lines
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

    cv2.putText(
        annotated,
        f"A : {zones['A']}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.putText(
        annotated,
        f"B : {zones['B']}",
        (w - 140, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.putText(
        annotated,
        f"C : {zones['C']}",
        (20, h - 20),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    cv2.putText(
        annotated,
        f"D : {zones['D']}",
        (w - 140, h - 20),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    # =====================================================
    # AI Command Center Dashboard
    # =====================================================

    cv2.rectangle(
        annotated,
        (10, 60),
        (610, 500),
        (40, 40, 40),
        -1
    )

    cv2.putText(
        annotated,
        "CrowdShield AI Dashboard",
        (25, 90),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.85,
        (0, 255, 255),
        2
    )

    cv2.putText(
        annotated,
        f"People Count : {total_people}",
        (25, 130),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (255, 255, 255),
        2
    )

    cv2.putText(
        annotated,
        f"Risk Level : {risk['risk']}",
        (25, 165),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        risk["color"],
        2
    )

    cv2.putText(
        annotated,
        f"Highest Risk Zone : {risk['highest_zone']}",
        (25, 200),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (255, 255, 255),
        2
    )

    cv2.putText(
        annotated,
        f"Reason : {risk['reason']}",
        (25, 235),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.70,
        (255, 255, 255),
        2
    )

    cv2.line(
        annotated,
        (20, 255),
        (590, 255),
        (80, 80, 80),
        2
    )

    cv2.putText(
        annotated,
        "AI Recommendations",
        (25, 285),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.75,
        (0, 255, 255),
        2
    )

    y = 320

    for rec in recommendation["recommendations"]:

        cv2.putText(
            annotated,
            f"- {rec}",
            (35, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.60,
            (255, 255, 255),
            2
        )

        y += 32

    # =====================================================
    # Display
    # =====================================================

    cv2.imshow("CrowdShield AI", annotated)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# =====================================================
# Cleanup
# =====================================================

cap.release()
cv2.destroyAllWindows()

print(f"\nProcessed {frame_count} frames successfully.")