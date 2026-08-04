class RecommendationEngine:

    def generate(self, risk_info):

        risk = risk_info["risk"]
        zone = risk_info["highest_zone"]
        people = risk_info["total_people"]

        recommendations = []

        if risk == "LOW":

            recommendations.append("Continue Monitoring")

        elif risk == "MEDIUM":

            recommendations.extend([
                f"Deploy Extra Security to Zone {zone}",
                "Monitor Crowd Continuously"
            ])

        elif risk == "HIGH":

            recommendations.extend([
                f"Open Exit Gate near Zone {zone}",
                f"Deploy Security Team to Zone {zone}",
                f"Broadcast Warning in Zone {zone}",
                "Restrict New Entry"
            ])

        # Extra Rule

        if people >= 40:
            recommendations.append("Prepare Emergency Response Team")

        return {
            "highest_zone": zone,
            "priority": risk,
            "action_required": risk != "LOW",
            "recommendations": recommendations
        }