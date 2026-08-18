from threading import Thread, Lock

from tracking.tracker import start_tracker

import backend.state as state


tracker_thread = None
tracker_lock = Lock()


def start_tracking():
    """Start the tracker thread if it is not already running."""
    global tracker_thread

    with tracker_lock:
        if tracker_thread is not None and tracker_thread.is_alive():
            print("ℹ️ Tracker thread is already running")
            return

        tracker_thread = Thread(
            target=start_tracker,
            daemon=True,
            name="CrowdShieldTracker"
        )

        tracker_thread.start()

        print("✅ Tracker thread started")


def restart_tracking(new_source: str):
    """
    Stop the currently running tracker and restart it
    using a new video source.
    """

    global tracker_thread

    new_source = str(new_source).strip()

    if not new_source:
        raise ValueError("Video source cannot be empty.")

    # Tell the running tracker to stop
    state.stop_tracking = True

    # Get current thread
    with tracker_lock:
        current_thread = tracker_thread

    # Wait for current tracker to finish
    if current_thread is not None and current_thread.is_alive():
        print("🛑 Stopping current tracker...")

        current_thread.join(timeout=10)

        if current_thread.is_alive():
            raise RuntimeError(
                "The current tracker did not stop within 10 seconds."
            )

    # Set new source
    state.current_video_source = new_source

    # Reset stop flag
    state.stop_tracking = False

    with tracker_lock:
        tracker_thread = None

    # Start new tracker
    start_tracking()

    print(f"🔄 Tracker restarted with source: {new_source}")