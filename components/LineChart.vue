<template>
  <div>
    <div class="chart-container relative">
      <canvas
        id="myChart"
        ref="chart"
        height="400"
      />
    </div>
    <button
      class="p-3 my-2 text-sm hover:bg-grey-lighter rounded-sm uppercase"
      @click="toggleViewType">
      {{ linear ? 'linear' : 'logarithmic' }}
    </button>
  </div>
</template>

<script>
import 'chart.js';
import { debounce } from 'underscore';

export default {
  props: {
    datasets: { type: Array, required: true },
    labels: { type: Array, required: true },
  },
  data: () => ({
    chart: null,
    linear: true,
    offsets: {},
  }),
  watch: {
    datasets: {
      deep: true,
      handler() {
        this.debounceUpdate();
      },
    },
  },
  mounted() {
    this.render();
    this.debounceUpdate = debounce(this.update, 200);
  },
  methods: {
    toggleViewType() {
      this.linear = !this.linear;
      this.chart.options.scales.yAxes[0].type = this.linear ? 'linear' : 'logarithmic';
      this.chart.update();
    },
    render() {
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
    update() {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets = this.datasets;
      this.chart.update();
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
