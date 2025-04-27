import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: "Activity Count",
        data: data.map(d => d.value),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  };

  return <Bar data={chartData} />;
};

export const LineChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: "Progress",
        data: data.map(d => d.value),
        borderColor: "rgb(99, 102, 241)",
        tension: 0.1,
      },
    ],
  };

  return <Line data={chartData} />;
};