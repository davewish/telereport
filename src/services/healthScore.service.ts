export const calculateHealthScore = (report: {
  heartRate: number;
  oxygenLevel: number;
  temperature: number;
}) => {
  let score = 100;
  if (report.oxygenLevel < 95) score -= 30;
  if (report.temperature > 38) score -= 20;
  if (report.heartRate < 60 || report.heartRate > 100) score -= 20;
  if (score >= 80) return { score, status: "Stable" };
  if (score >= 50) return { score, status: "Monitor" };
  return { score, status: "Critical" };
};
