import cv2
import numpy as np


class CrowdHeatmap:

    def __init__(self):
        self.heatmap = None

    def initialize(self, width, height):
        self.heatmap = np.zeros((height, width), dtype=np.float32)

    def update(self, x, y):

        cv2.circle(
            self.heatmap,
            (x, y),
            35,
            1,
            -1
        )

        # Smooth the heat
        self.heatmap = cv2.GaussianBlur(
            self.heatmap,
            (0, 0),
            15
        )

    def draw(self, frame):

        normalized = cv2.normalize(
            self.heatmap,
            None,
            0,
            255,
            cv2.NORM_MINMAX
        )

        normalized = normalized.astype(np.uint8)

        colored = cv2.applyColorMap(
            normalized,
            cv2.COLORMAP_JET
        )

        return cv2.addWeighted(
            frame,
            0.7,
            colored,
            0.3,
            0
        )