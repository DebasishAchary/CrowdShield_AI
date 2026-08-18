import time
import cv2

from fastapi.responses import StreamingResponse

import backend.state as state


def generate():

    while True:

        with state.frame_lock:
            frame = (
                state.latest_frame.copy()
                if state.latest_frame is not None
                else None
            )

        if frame is None:
            time.sleep(0.02)   # wait 20 ms
            continue

        success, buffer = cv2.imencode(".jpg", frame)

        if not success:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + buffer.tobytes()
            + b"\r\n"
        )


def video_feed():

    return StreamingResponse(
        generate(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )