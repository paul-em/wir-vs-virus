<template>
  <div class="py-4 px-8 m-2 shadow-lg flex justify-center items-center kpi-card">
    <div class="text-center">
      <img
        v-if="img"
        :src="img">
    </div>
    <label>{{ label }}</label>
    <div>
      <div class="text-xl px-2">
        {{ formatNumber(value) }}*
      </div>
      <div class="px-2 text-green">
        -{{ formatNumber(worstCaseValue - value) }}
      </div>
    </div>
    <div
      :style="{ width: calcWorstCasePercent() + '%' }"
      class="worst-case-percent"/>
    <div class="worst-case-label">
      {{ $t('label.worst-case-precent') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, required: true },
    value: { type: Number, default: 0 },
    worstCaseValue: { type: Number, default: 0 },
    img: { type: String, default: null },
  },
  methods: {
    formatNumber(num) {
      return Math.floor(num).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },
    calcWorstCasePercent() {
      return (this.value / this.worstCaseValue) * 100.0;
    },
  },
};
</script>

<style scoped>
  img {
    max-height: 64px;
  }
  .kpi-card {
    position: relative;
  }
  .worst-case-percent {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: rgb(255, 204, 204);
    z-index: -1;
  }
  .worst-case-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-style: italic;
    color: rgb(102, 102, 102);
  }
</style>
