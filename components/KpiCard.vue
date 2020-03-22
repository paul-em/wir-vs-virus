<template>
  <div class="py-4 px-8 m-2 shadow-lg">
    <div class="text-center">
      <img
        v-if="img"
        :src="img">
    </div>
    <label>{{ label }}</label>
    <div class="inline-block text-xl">{{ formatNumber(value) }}</div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, required: true },
    value: { type: Number, default: 0 },
    img: { type: String, default: null },
  },
  methods: {
    formatNumber(num) {
      return Math.floor(num).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },
  },
};
</script>

<style scoped>
  img {
    max-height: 64px;
  }
</style>
