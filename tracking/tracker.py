from pathlib import Path
import time
import cv2

from detection.detector import PersonDetector
from analytics.density import CrowdDensity
from prediction.risk_engine import RiskEngine
from recommendation.recommender import RecommendationEngine
from analytics.flow import CrowdFlow
from analytics.bottleneck import BottleneckDetector

import backend.state as state


# =====================================================
# PROJECT PATHS
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

VIDEO = (
    BASE_DIR
    / "datasets"
    / "videos"
    / "crowd1.mp4"
)


# =====================================================
# TRACKER
# =====================================================

def start_tracker():

    print("=" * 60)
    print("CrowdShield AI - Tracking & AI Decision Support")
    print("=" * 60)


    # =================================================
    # INITIALIZE AI MODULES
    # =================================================

    detector = PersonDetector()

    density = CrowdDensity()

    risk_engine = RiskEngine()

    recommender = RecommendationEngine()

    flow = CrowdFlow()

    bottleneck = BottleneckDetector()


    # =================================================
    # GET VIDEO SOURCE
    # =================================================

    source = state.current_video_source

    source_string = str(source).strip()

    is_phone_camera = (
        source_string.lower() == "phone"
    )


    # =================================================
    # NORMAL CAMERA / VIDEO SOURCE
    # =================================================

    cap = None

    if not is_phone_camera:

        # Convert "0" to webcam index 0
        if source_string == "0":
            source = 0

        # Convert "1" to webcam index 1
        elif source_string == "1":
            source = 1

        else:
            source = source_string


        print(
            f"🎥 Opening video source: {source}"
        )


        cap = cv2.VideoCapture(source)


        if not cap.isOpened():

            print(
                f"❌ Failed to open video source: {source}"
            )

            return


    # =================================================
    # PHONE CAMERA MODE
    # =================================================

    else:

        print(
            "📱 Phone camera mode enabled"
        )

        print(
            "⏳ Waiting for phone camera frames..."
        )


    # =================================================
    # FRAME COUNTER
    # =================================================

    frame_count = 0


    # =================================================
    # MAIN TRACKING LOOP
    # =================================================

    while True:


        # =============================================
        # CHECK STOP REQUEST
        # =============================================

        if state.stop_tracking:

            print(
                "🛑 Tracker stop requested."
            )

            break


        # =============================================
        # GET FRAME
        # =============================================

        if is_phone_camera:

            # -----------------------------------------
            # PHONE CAMERA
            # -----------------------------------------

            with state.phone_frame_lock:

                if state.phone_frame is not None:

                    frame = (
                        state.phone_frame.copy()
                    )

                else:

                    frame = None


            # No phone frame yet
            if frame is None:

                time.sleep(0.02)

                continue


        else:

            # -----------------------------------------
            # NORMAL VIDEO / WEBCAM
            # -----------------------------------------

            if cap is None:
                break


            ret, frame = cap.read()


            if not ret:

                print(
                    "🎬 Video source ended."
                )

                break


        # =============================================
        # FRAME COUNT
        # =============================================

        frame_count += 1


        # =============================================
        # RESIZE
        # =============================================

        try:

            frame = cv2.resize(
                frame,
                (1280, 720)
            )

        except Exception as exc:

            print(
                f"⚠️ Frame resize error: {exc}"
            )

            continue


        # =============================================
        # ANNOTATED FRAME
        # =============================================

        annotated = frame.copy()


        # =============================================
        # RESET ANALYTICS
        # =============================================

        density.reset()

        flow.reset()


        # =============================================
        # PERSON DETECTION / TRACKING
        # =============================================

        try:

            results = detector.track(
                frame
            )

        except Exception as exc:

            print(
                f"❌ Detection error: {exc}"
            )

            time.sleep(0.05)

            continue


        # =============================================
        # GET DETECTION BOXES
        # =============================================

        boxes = results[0].boxes


        if boxes.id is not None:

            for box in boxes:

                # -------------------------------------
                # BOUNDING BOX
                # -------------------------------------

                x1, y1, x2, y2 = map(
                    int,
                    box.xyxy[0]
                )


                # -------------------------------------
                # TRACK ID
                # -------------------------------------

                track_id = int(
                    box.id[0]
                )


                # -------------------------------------
                # DRAW BOUNDING BOX
                # -------------------------------------

                cv2.rectangle(
                    annotated,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    2
                )


                # -------------------------------------
                # TRACKING ID
                # -------------------------------------

                cv2.putText(
                    annotated,
                    f"ID:{track_id}",
                    (x1, y1 - 8),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 255, 0),
                    2
                )


                # -------------------------------------
                # PERSON CENTER
                # -------------------------------------

                center_x = (
                    x1 + x2
                ) // 2

                center_y = (
                    y1 + y2
                ) // 2


                cv2.circle(
                    annotated,
                    (
                        center_x,
                        center_y
                    ),
                    4,
                    (0, 0, 255),
                    -1
                )


                # -------------------------------------
                # DENSITY
                # -------------------------------------

                density.update(
                    center_x,
                    center_y,
                    frame.shape[1],
                    frame.shape[0]
                )


                # -------------------------------------
                # FLOW
                # -------------------------------------

                flow.update(
                    track_id,
                    center_x,
                    center_y
                )


        # =================================================
        # CROWD DENSITY
        # =================================================

        zones = density.get_counts()


        # =================================================
        # RISK
        # =================================================

        risk = risk_engine.evaluate(
            zones
        )


        # =================================================
        # RECOMMENDATIONS
        # =================================================

        recommendation = (
            recommender.generate(
                risk
            )
        )


        # =================================================
        # FLOW
        # =================================================

        flow_stats = flow.get_flow()


        # =================================================
        # BOTTLENECK
        # =================================================

        bottleneck_info = (
            bottleneck.detect(
                zones,
                flow_stats
            )
        )


        # =================================================
        # UPDATE BACKEND STATE
        # =================================================

        total_people = (
            risk["total_people"]
        )


        state.latest_data.update({

            "people":
                total_people,

            "risk":
                risk["risk"],

            "highest_zone":
                risk["highest_zone"],

            "zones":
                zones.copy(),

            "flow":
                flow_stats.copy(),

            "recommendations":
                recommendation[
                    "recommendations"
                ].copy(),

            "bottleneck":
                bottleneck_info.copy(),

        })


        # =================================================
        # DRAW ZONE LINES
        # =================================================

        h, w = annotated.shape[:2]


        cv2.line(
            annotated,
            (w // 2, 0),
            (w // 2, h),
            (0, 255, 255),
            2
        )


        cv2.line(
            annotated,
            (0, h // 2),
            (w, h // 2),
            (0, 255, 255),
            2
        )


        # =================================================
        # ZONE COUNTS
        # =================================================

        cv2.putText(
            annotated,
            f"A : {zones['A']}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )


        cv2.putText(
            annotated,
            f"B : {zones['B']}",
            (w - 140, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )


        cv2.putText(
            annotated,
            f"C : {zones['C']}",
            (20, h - 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )


        cv2.putText(
            annotated,
            f"D : {zones['D']}",
            (w - 140, h - 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )


        # =================================================
        # AI DASHBOARD
        # =================================================

        cv2.putText(
            annotated,
            f"People : {total_people}",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 255),
            2
        )


        cv2.putText(
            annotated,
            f"Risk : {risk['risk']}",
            (20, 115),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            risk["color"],
            2
        )


        cv2.putText(
            annotated,
            f"Zone : {risk['highest_zone']}",
            (20, 150),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2
        )


        # =================================================
        # PUBLISH PROCESSED FRAME
        # =================================================

        with state.frame_lock:

            state.latest_frame = (
                annotated.copy()
            )


        # =================================================
        # PHONE CAMERA STATUS
        # =================================================

        if is_phone_camera:

            state.phone_camera_connected = True


        # =================================================
        # LOCAL DISPLAY
        #
        # Don't open a laptop window for phone camera.
        # =================================================

        if not is_phone_camera:

            cv2.imshow(
                "CrowdShield AI",
                annotated
            )

            if (
                cv2.waitKey(1) & 0xFF
                == ord("q")
            ):

                break


        # =================================================
        # DEBUG
        # =================================================

        if frame_count % 30 == 0:

            print("=" * 50)

            print(
                f"Source        : "
                f"{state.current_video_source}"
            )

            print(
                f"People        : "
                f"{total_people}"
            )

            print(
                f"Risk          : "
                f"{risk['risk']}"
            )

            print(
                f"Highest Zone  : "
                f"{risk['highest_zone']}"
            )

            print(
                f"Flow          : "
                f"{flow_stats}"
            )

            print(
                f"Bottleneck    : "
                f"{bottleneck_info}"
            )


    # =================================================
    # CLEANUP
    # =================================================

    if cap is not None:

        cap.release()


    cv2.destroyAllWindows()


    print(
        f"\nProcessed "
        f"{frame_count} frames successfully."
    )


# =====================================================
# DIRECT EXECUTION
# =====================================================

if __name__ == "__main__":

    start_tracker()