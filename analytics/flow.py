class CrowdFlow:

    def __init__(self):

        # Previous position of every tracked person
        self.previous_positions = {}

        # Flow counters
        self.flow = {
            "UP": 0,
            "DOWN": 0,
            "LEFT": 0,
            "RIGHT": 0,
            "STATIONARY": 0
        }

    def reset(self):
        """
        Reset flow counters every frame.
        Previous positions are preserved.
        """
        self.flow = {
            "UP": 0,
            "DOWN": 0,
            "LEFT": 0,
            "RIGHT": 0,
            "STATIONARY": 0
        }

    def update(self, track_id, center_x, center_y):

        # First appearance of this person
        if track_id not in self.previous_positions:

            self.previous_positions[track_id] = (center_x, center_y)
            return

        prev_x, prev_y = self.previous_positions[track_id]

        dx = center_x - prev_x
        dy = center_y - prev_y

        # Ignore tiny movements (camera noise)
        threshold = 5

        if abs(dx) < threshold and abs(dy) < threshold:

            self.flow["STATIONARY"] += 1

        elif abs(dx) > abs(dy):

            if dx > 0:
                self.flow["RIGHT"] += 1
            else:
                self.flow["LEFT"] += 1

        else:

            if dy > 0:
                self.flow["DOWN"] += 1
            else:
                self.flow["UP"] += 1

        # Save latest position
        self.previous_positions[track_id] = (center_x, center_y)

    def get_flow(self):

        return self.flow