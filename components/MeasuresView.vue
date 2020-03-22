<template>
  <section>
    <div
      v-for="measure in measures"
      :key="measure.label"
      :class="{ 'line-through': measure.max < rValue}">
      {{ measure.label }}
    </div>
  </section>
</template>

<script>
export default {
  props: {
    rValue: { type: Number, required: true },
  },
  computed: {
    measures() {
      return [
        {
          label: 'Jogging',
          max: 80,
        },
        {
          label: 'Festival',
          max: 10,
        },
      ];
    },
  },
};
</script>

<style>
</style>
