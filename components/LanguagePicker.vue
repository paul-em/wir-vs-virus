<template>
  <div>
    <v-select
      v-model="$i18n.locale"
      :options="languageOptions"
      :clearable="false"/>
  </div>
</template>

<script>
import vSelect from 'vue-select';

export default {
  components: {
    vSelect,
  },
  props: {
  },
  computed: {
    languageOptions() {
      // get languages available in i18n
      return this.$i18n.availableLocales;
    },
  },
};
</script>
