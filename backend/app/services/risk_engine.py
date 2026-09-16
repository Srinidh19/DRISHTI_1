from typing import Dict, Any, List

class RiskEngine:
    @staticmethod
    def calculate_risk(
        zone_type: str = "CRITICAL_PERIMETER",
        fence_crossed: bool = True,
        multi_camera_confirmed: bool = True,
        direction_threat: bool = True,
        activity_score: int = 6,
        evidence_quality: int = 4
    ) -> Dict[str, Any]:
        breakdown = {
            "zone_criticality": 25 if zone_type == "CRITICAL_PERIMETER" else 10,
            "fence_crossing": 25 if fence_crossed else 0,
            "multi_camera_confirm": 20 if multi_camera_confirmed else 0,
            "movement_direction": 12 if direction_threat else 0,
            "activity": activity_score,
            "evidence_quality": evidence_quality
        }
        total_score = sum(breakdown.values())
        total_score = min(100, max(0, total_score))

        explanations: List[str] = []
        if breakdown["zone_criticality"] >= 20:
            explanations.append("Critical Zero Line buffer zone proximity")
        if breakdown["fence_crossing"] > 0:
            explanations.append("Virtual Perimeter Fence Alpha breached")
        if breakdown["multi_camera_confirm"] > 0:
            explanations.append("Confirmed correlation across CAM-03 & CAM-04")
        if breakdown["movement_direction"] > 0:
            explanations.append("Trajectory vector heading south toward high-security post")
        if breakdown["activity"] > 0:
            explanations.append("Tactical pedestrian cadence with rapid traversal")
        if breakdown["evidence_quality"] > 0:
            explanations.append("Dual-sensor evidence recorded (IR thermal + optical HD)")

        return {
            "score": total_score,
            "breakdown": breakdown,
            "explanations": explanations
        }

risk_engine = RiskEngine()
