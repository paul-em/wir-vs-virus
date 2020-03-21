<template>
  <section class="text-center">
    <h3>Corona Virus</h3>
    <h1>
      What can <span class="font-black font-serif">I</span> do?
    </h1>
    <div class="p-4">
      <v-select
        v-model="selectedLocation" 
        :options="locationOptions"
        label="label"/>
    </div>
    <div class="p-4">
      <v-slider v-model="rValue"/>
    </div>
    <line-chart
      v-if="selectedLocation"
      :datasets="datasets" 
      :labels="dates"/>
  </section>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import vSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import Logo from '~/components/Logo.vue'
import LineChart from '~/components/LineChart.vue'

function formatDate(str) {
  const d = new Date(str)
  return `${d.getFullYear()}-${fill(d.getMonth() + 1)}-${fill(d.getDate())}`
}

function fill(num) {
  if (num < 10) {
    return `0${num}`
  }
  return `${num}`
}

export default {
  async asyncData({ app: { $loader } }) {
    return {
      data: await $loader.load()
    }
  },
  components: {
    Logo,
    LineChart,
    vSelect,
    vSlider
  },
  data: () => ({
    data: [],
    selectedLocation: {
      country: 'Germany',
      province: '',
      label: 'Germany'
    },
    rValue: 0.5
  }),
  computed: {
    locationOptions() {
      return this.data.confirmed.map(item => ({
        country: item['Country/Region'],
        province: item['Province/State'],
        label: `${item['Country/Region']} ${item['Province/State']}`
      }))
    },
    dates() {
      const confirmedData = this.data.confirmed.find(
        item =>
          item['Country/Region'] === this.selectedLocation.country &&
          item['Province/State'] === this.selectedLocation.province
      )
      const confirmedTimeline = Object.keys(confirmedData).filter(
        i => !['Province/State', 'Country/Region', 'Lat', 'Long'].includes(i)
      )
      return confirmedTimeline
    },
    datasets() {
      const confirmedData = this.data.confirmed.find(
        item =>
          item['Country/Region'] === this.selectedLocation.country &&
          item['Province/State'] === this.selectedLocation.province
      )
      const deathsData = this.data.deaths.find(
        item =>
          item['Country/Region'] === this.selectedLocation.country &&
          item['Province/State'] === this.selectedLocation.province
      )
      const recoveredData = this.data.recovered.find(
        item =>
          item['Country/Region'] === this.selectedLocation.country &&
          item['Province/State'] === this.selectedLocation.province
      )
      const confirmedTimeline = Object.keys(confirmedData)
        .filter(
          i => !['Province/State', 'Country/Region', 'Lat', 'Long'].includes(i)
        )
        .map(key => confirmedData[key])
      const deathsTimeline = Object.keys(deathsData)
        .filter(
          i => !['Province/State', 'Country/Region', 'Lat', 'Long'].includes(i)
        )
        .map(key => deathsData[key])
      const recoveredTimeline = Object.keys(recoveredData)
        .filter(
          i => !['Province/State', 'Country/Region', 'Lat', 'Long'].includes(i)
        )
        .map(key => recoveredData[key])
      return [
        {
          label: 'Confirmed',
          data: confirmedTimeline,
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          borderColor: 'rgba(0, 0, 255, 0.8)'
        },
        {
          label: 'Deaths',
          data: deathsTimeline,
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          borderColor: 'rgba(255, 0, 0, 0.8)'
        },
        {
          label: 'Recovered',
          data: recoveredTimeline,
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          borderColor: 'rgba(0, 255, 0, 0.8)'
        }
      ]
    }
  }
}
</script>

<style>
</style>
