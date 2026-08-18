from threading import Thread

from tracking.tracker import start_tracker

tracker_thread = None


def start_tracking():
    global tracker_thread

    if tracker_thread is None:
        tracker_thread = Thread(
            target=start_tracker,
            daemon=True
        )

        tracker_thread.start()

        print("✅ Tracker thread started")