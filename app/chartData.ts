export const getChartData = (riskData: {
  high: number;
  medium: number;
  low: number;
}) => ({
  labels: ["High Risk", "Medium Risk", "Low Risk"],
  datasets: [
    {
      data: [riskData.high, riskData.medium, riskData.low],
      backgroundColor: ["#ef4444", "#f97316", "#22c55e"],
      borderWidth: 0,
    },
  ],
});
