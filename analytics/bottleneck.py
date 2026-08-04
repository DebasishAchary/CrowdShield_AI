class BottleneckDetector:

    def detect(self, zones, flow):

        highest_zone = max(zones, key=zones.get)
        highest_count = zones[highest_zone]

        moving = (
            flow["UP"]
            + flow["DOWN"]
            + flow["LEFT"]
            + flow["RIGHT"]
        )

        stationary = flow["STATIONARY"]

        bottleneck = False

        reason = "No Bottleneck"

        if highest_count >= 15 and stationary > moving:

            bottleneck = True

            reason = (
                f"Heavy crowd with low movement near Zone {highest_zone}"
            )

        return {

            "bottleneck": bottleneck,

            "zone": highest_zone,

            "reason": reason
        }