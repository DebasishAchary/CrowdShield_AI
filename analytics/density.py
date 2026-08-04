class CrowdDensity:
    def __init__(self):
        self.reset()

    def reset(self):
        self.zones = {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0
        }

    def update(self, x, y, width, height):
        mid_x = width // 2
        mid_y = height // 2

        if x < mid_x and y < mid_y:
            self.zones["A"] += 1
        elif x >= mid_x and y < mid_y:
            self.zones["B"] += 1
        elif x < mid_x and y >= mid_y:
            self.zones["C"] += 1
        else:
            self.zones["D"] += 1

    def get_counts(self):
        return self.zones