class RiskEngine:

    def evaluate(self, zones):

        total_people = sum(zones.values())

        highest_zone = max(zones, key=zones.get)
        highest_count = zones[highest_zone]

        if highest_count >= 15:
            risk = "HIGH"
            reason = "Critical Crowd Density"
            color = (0, 0, 255)

        elif highest_count >= 8:
            risk = "MEDIUM"
            reason = "Crowd Building Up"
            color = (0, 255, 255)

        else:
            risk = "LOW"
            reason = "Crowd Normal"
            color = (0, 255, 0)

        return {
            "risk": risk,
            "reason": reason,
            "color": color,
            "highest_zone": highest_zone,
            "highest_count": highest_count,
            "total_people": total_people
        }