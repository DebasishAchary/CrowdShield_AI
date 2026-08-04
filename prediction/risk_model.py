class RiskEngine:

    def __init__(self):
        self.risk = "LOW"
        self.reason = "Crowd Normal"
        self.color = (0, 255, 0)

    def evaluate(self, zones):

        total = sum(zones.values())
        highest = max(zones.values())

        # -------------------------------
        # Risk Rules (MVP)
        # -------------------------------

        if highest >= 12:
            self.risk = "HIGH"
            self.reason = "Crowd Congestion"

        elif highest >= 8:
            self.risk = "MEDIUM"
            self.reason = "Crowd Building Up"

        else:
            self.risk = "LOW"
            self.reason = "Crowd Normal"

        # Color
        if self.risk == "LOW":
            self.color = (0,255,0)

        elif self.risk == "MEDIUM":
            self.color = (0,255,255)

        else:
            self.color = (0,0,255)

        return {
            "risk": self.risk,
            "reason": self.reason,
            "color": self.color,
            "total_people": total,
            "highest_zone": highest
        }