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
          label: this.$t('slider.stay-at-home'),
          value: 0,
        },
        {
          label: this.$t('slider.going-for-run-alone'),
          value: 10,
        },
        {
          label: this.$t('slider.less-than-2m-distance'),
          value: 20,
        },
        {
          label: this.$t('slider.shake-hands'),
          value: 30,
        },
        {
          label: this.$t('slider.going-out-dine-with-friends'),
          value: 40,
        },
        {
          label: this.$t('slider.shopping'),
          value: 50,
        },
        {
          label: this.$t('slider.hug-kiss-with-friends'),
          value: 60,
        },
        {
          label: this.$t('slider.flat-party'),
          value: 70,
        },
        {
          label: this.$t('slider.daily-canteen-visit'),
          value: 80,
        },
        {
          label: this.$t('slider.go-clubbing'),
          value: 90,
        },
        {
          label: this.$t('slider.visit-festival'),
          value: 100,
        },
      ];
    },
  },
};
</script>

<style>
</style>
