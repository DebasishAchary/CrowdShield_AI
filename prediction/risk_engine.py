class RiskEngine:

    def evaluate(self, zones):

        total_people = sum(zones.values())
        max_zone = max(zones.values())

        if max_zone >= 15:
            return {
                "risk": "HIGH",
                "reason": "Critical Crowd Density",
                "recommendation": "Open Exit Gate 2 | Deploy Security",
                "color": (0, 0, 255)
            }

        elif max_zone >= 8:
            return {
                "risk": "MEDIUM",
                "reason": "Crowd Building Up",
                "recommendation": "Deploy Extra Security",
                "color": (0, 255, 255)
            }

        else:
            return {
                "risk": "LOW",
                "reason": "Crowd Normal",
                "recommendation": "Continue Monitoring",
                "color": (0, 255, 0)
            }