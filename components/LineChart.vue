<template>
  <div>
    <div class="chart-container relative">
      <canvas
        id="myChart"
        ref="chart"
        height="400"
      />
    </div>
  </div>
</template>

<script>
import 'chart.js';

export default {
  props: {
    datasets: { type: Array, required: true },
    labels: { type: Array, required: true },
  },
  data: () => ({
    chart: null,
    offsets: {},
  }),
  watch: {
    datasets: {
      deep: true,
      handler() {
        this.chart.data.labels = this.labels;
        this.chart.data.datasets = this.datasets;
        this.chart.update();
      },
    },
    maxValue() {
      this.update();
    },
  },
  mounted() {
    this.update();
  },
  methods: {
    update() {
      this.chart = new window.Chart(this.$refs.chart, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: this.datasets,
        },
        options: {
          animation: {
            duration: 0,
          },
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                type: 'linear',
              },
            ],
          },
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
}

.chart-container {
  width: 100%;
  min-width: 360px;
  height: 400px;
}
</style>
