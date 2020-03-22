<template>
  <section class="flex">
    <div
      v-for="measure in measures"
      :key="measure.label"
      :class="{
        'line-through': measure.value > rValue,
        'opacity-50': measure.value > rValue,
      }"
      class="p-2 flex-1">
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
          label: 'Stay at home',
          value: 0,
        },
        {
          label: 'Going for a run alone',
          value: 10,
        },
        {
          label: 'Less than 2m distance',
          value: 20,
        },
        {
          label: 'Shake hands',
          value: 30,
        },
        {
          label: 'Going out to dine with friends',
          value: 40,
        },
        {
          label: 'Shopping',
          value: 50,
        },
        {
          label: 'Hug and Kiss when you meet friends',
          value: 60,
        },
        {
          label: 'Flat Party',
          value: 70,
        },
        {
          label: 'Daily Canteen Visit',
          value: 80,
        },
        {
          label: 'Go Clubbing',
          value: 90,
        },
        {
          label: 'Visit a Festival',
          value: 100,
        },
      ];
    },
  },
};
</script>

<style>
</style>
