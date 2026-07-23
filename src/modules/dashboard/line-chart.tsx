import type { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface LineChartProps {
  color: string;
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const LineChart = ({ color }: LineChartProps) => {
  const series = [
    {
      name: 'Products',
      data: Array(9)
        .fill(1)
        .map(() => getRandomInt(1000)),
    },
  ];

  const options: ApexOptions = {
    colors: [color],
    tooltip: {
      theme: undefined,
      y: {
        title: {
          formatter() {
            return '';
          },
        },
      },
    },
    chart: {
      toolbar: {
        show: false,
      },
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: 'straight',
    },
    grid: {
      show: false,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: { show: false },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
      ],
    },
  };
  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      width={100}
      height={80}
    />
  );
};
