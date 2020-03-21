<template>
  <section class="container">
    <div>
      <h1 class="title">
        wir-vs-virus
      </h1>
      <h2 class="subtitle">
        Hackathon Project 1757
      </h2>
      <v-select 
        v-model="selectedLocation" 
        :options="locationOptions"
        label="label"/>
      <line-chart 
        v-if="selectedLocation"
        :datasets="datasets" 
        :labels="dates"/>
    </div>
  </section>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
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
    vSelect
  },
  data: () => ({
    data: [],
    selectedLocation: {
      country: 'Germany',
      province: '',
      label: 'Germany'
    }
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
          data: confirmedTimeline
        },
        {
          label: 'Deaths',
          data: deathsTimeline
        },
        {
          label: 'Recovered',
          data: recoveredTimeline
        }
      ]
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
