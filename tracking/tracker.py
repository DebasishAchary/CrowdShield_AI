from pathlib import Path
import cv2

from detection.detector import PersonDetector
from analytics.density import CrowdDensity
from prediction.risk_engine import RiskEngine
from recommendation.recommender import RecommendationEngine
# from analytics.heatmap import CrowdHeatmap
from analytics.flow import CrowdFlow
from analytics.bottleneck import BottleneckDetector
from backend.state import latest_data

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
# heatmap = CrowdHeatmap()
flow = CrowdFlow()
bottleneck = BottleneckDetector()

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
    flow.reset()

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
            # heatmap.update(
            #     center_x,
            #     center_y
            # )
            flow.update(
                track_id,
                center_x,
                center_y
            )

    # =====================================================
    # Crowd Density Analysis
    # =====================================================

    zones = density.get_counts()

    risk = risk_engine.evaluate(zones)

    recommendation = recommender.generate(risk)

    flow_stats = flow.get_flow()

    bottleneck_info = bottleneck.detect(
    zones,
    flow_stats
    )

    # =====================================================
    # Update Shared Backend State
    # =====================================================

    total_people = risk["total_people"]

    latest_data.update({
        "people": total_people,
        "risk": risk["risk"],
        "highest_zone": risk["highest_zone"],
        "zones": zones.copy(),
        "flow": flow_stats.copy(),
        "recommendations": recommendation["recommendations"].copy(),
        "bottleneck": bottleneck_info.copy()
    })

    print("API Updated:", latest_data)

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

    cv2.putText(
        annotated,
        f"People : {total_people}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (255,255,255),
        2
    )

    cv2.putText(
        annotated,
        f"Risk : {risk['risk']}",
        (20, 75),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        risk["color"],
        2
    )

    cv2.putText(
        annotated,
        f"Zone : {risk['highest_zone']}",
        (20, 110),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0,255,255),
        2
    )

    # =====================================================
    # Crowd Flow Statistics
    # =====================================================

    # y += 20

    # cv2.line(
    #     annotated,
    #     (20, y),
    #     (590, y),
    #     (80, 80, 80),
    #     2
    # )

    # y += 35

    # cv2.putText(
    #     annotated,
    #     "Crowd Flow",
    #     (25, y),
    #     cv2.FONT_HERSHEY_SIMPLEX,
    #     0.75,
    #     (0, 255, 255),
    #     2
    # )

    # y += 35

    # cv2.putText(
    #     annotated,
    #     f"UP : {flow_stats['UP']}",
    #     (25, y),
    #     cv2.FONT_HERSHEY_SIMPLEX,
    #     0.6,
    #     (255,255,255),
    #     2
    # )

    # y += 30

    # cv2.putText(
    #     annotated,
    #     f"DOWN : {flow_stats['DOWN']}",
    #     (25, y),
    #     cv2.FONT_HERSHEY_SIMPLEX,
    #     0.6,
    #     (255,255,255),
    #     2
    # )

    # y += 30

    # cv2.putText(
    #     annotated,
    #     f"LEFT : {flow_stats['LEFT']}",
    #     (25, y),
    #     cv2.FONT_HERSHEY_SIMPLEX,
    #     0.6,
    #     (255,255,255),
    #     2
    # )

    # y += 30

    # cv2.putText(
    #     annotated,
    #     f"RIGHT : {flow_stats['RIGHT']}",
    #     (25, y),
    #     cv2.FONT_HERSHEY_SIMPLEX,
    #     0.6,
    #     (255,255,255),
    #     2
    # )

    # y += 30

    # cv2.putText(
    #     annotated,
    #     f"STATIONARY : {flow_stats['STATIONARY']}",
    #     (25, y),
    #     cv2.FONT_HERSHEY_SIMPLEX,
    #     0.6,
    #     (255,255,255),
    #     2
    # )

    # =====================================================
    # Display
    # =====================================================

    cv2.imshow("CrowdShield AI", annotated)

    print("=" * 50)
    print(f"People        : {total_people}")
    print(f"Risk          : {risk['risk']}")
    print(f"Highest Zone  : {risk['highest_zone']}")
    print(f"Flow          : {flow_stats}")
    print(f"Bottleneck    : {bottleneck_info}")

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# =====================================================
# Cleanup
# =====================================================

cap.release()
cv2.destroyAllWindows()

print(f"\nProcessed {frame_count} frames successfully.")