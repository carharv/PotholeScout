<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: { Bar },

  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartId: {
      type: String,
      default: "bar-chart",
    },
    width: {
      type: Number,
      default: 854,
    },
    height: {
      type: Number,
      default: 480,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {
        console.log();
      },
    },
    plugins: {
      type: Object,
      default: () => {
        console.log();
      },
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
      },
    };
  },
};
</script>
<style>
#bar-chart {
  padding-bottom: 20px;
}
</style>
