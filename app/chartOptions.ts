export const donutChartOptions = {
  cutout: "60%",
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        color: "#ffffff",
        font: { size: 11 },
        boxWidth: 15,
      },
    },
  },
  maintainAspectRatio: false,
};

export const barChartOptions = {
  indexAxis: "y",
  stacked: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#ffffff",
        font: { size: 11 },
        boxWidth: 15,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: { color: "#333" },
      ticks: {
        color: "#ffffff",
        font: { size: 10 },
      },
    },
    y: {
      stacked: true,
      grid: { color: "#333" },
      ticks: {
        color: "#ffffff",
        font: { size: 10 },
      },
    },
  },
};
