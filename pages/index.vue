<template>
  <section class="text-center p-16">
    <h3>Corona Virus</h3>
    <h1>
      What can <span class="font-black font-serif">I</span> do?
    </h1>
    <div class="pt-8">
      <v-select
        v-model="selectedLocation"
        :options="locationOptions"
        label="label"/>
      <div class="py-4">
        <v-slider
          :min="0"
          :max="100"
          v-model="rValue"/>
        {{ rValue }}
      </div>
      <line-chart
        v-if="selectedLocation"
        :datasets="datasets"
        :labels="dates"/>
    </div>
  </section>
</template>

<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import vSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import Logo from '../components/Logo.vue';
import LineChart from '../components/LineChart.vue';

function fill(num) {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
}

function formatDate(str) {
  const d = new Date(str);
  return `${d.getFullYear()}-${fill(d.getMonth() + 1)}-${fill(d.getDate())}`;
}


export default {
  async asyncData({ app: { $loader } }) {
    return {
      data: await $loader.load(),
    };
  },
  components: {
    Logo,
    LineChart,
    vSelect,
    vSlider,
  },
  data: () => ({
    data: [],
    selectedLocation: {
      country: 'China',
      province: 'Hubei',
      label: 'China Hubei',
    },
    rValue: 50,
  }),
  computed: {
    locationOptions() {
      return this.data.confirmed.map(item => ({
        country: item['Country/Region'],
        province: item['Province/State'],
        label: `${item['Country/Region']} ${item['Province/State']}`,
      }));
    },
    dates() {
      const dates = [];
      for (let day = 0; day < 300; day += 1) {
        dates.push(formatDate(new Date(2020, 0, 22 + day)));
      }
      return dates;
    },
    datasets() {
      const confirmedData = this.data.confirmed.find(
        item => item['Country/Region'] === this.selectedLocation.country
          && item['Province/State'] === this.selectedLocation.province,
      );
      const deathsData = this.data.deaths.find(
        item => item['Country/Region'] === this.selectedLocation.country
          && item['Province/State'] === this.selectedLocation.province,
      );
      const recoveredData = this.data.recovered.find(
        item => item['Country/Region'] === this.selectedLocation.country
          && item['Province/State'] === this.selectedLocation.province,
      );
      const confirmedTimeline = Object.keys(confirmedData)
        .filter(
          i => !['Province/State', 'Country/Region', 'Lat', 'Long'].includes(i),
        )
        .map(key => confirmedData[key]);
      const deathsTimeline = Object.keys(deathsData)
        .filter(
          i => !['Province/State', 'Country/Region', 'Lat', 'Long'].includes(i),
        )
        .map(key => deathsData[key]);
      const recoveredTimeline = Object.keys(recoveredData)
        .filter(
          i => !['Province/State', 'Country/Region', 'Lat', 'Long'].includes(i),
        )
        .map(key => recoveredData[key]);
      return [
        {
          label: 'Infected',
          data: confirmedTimeline
            .map((v, index) => v - recoveredTimeline[index]),
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          borderColor: 'rgba(0, 0, 255, 0.8)',
        },
        {
          label: 'Infected Prediction',
          data: this.getSimplePrediction(confirmedTimeline
            .map((v, index) => v - recoveredTimeline[index]), -1),
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          borderColor: 'rgba(0, 0, 255, 0.5)',
        },
        {
          label: 'Deaths',
          data: deathsTimeline,
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          borderColor: 'rgba(255, 0, 0, 0.8)',
        },
        {
          label: 'Deaths Prediction',
          data: this.getSimplePrediction(deathsTimeline, 1),
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          borderColor: 'rgba(255, 0, 0, 0.5)',
        },
        {
          label: 'Recovered',
          data: recoveredTimeline,
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          borderColor: 'rgba(0, 255, 0, 0.8)',
        },
        {
          label: 'Recovered Prediction',
          data: this.getSimplePrediction(recoveredTimeline, 1),
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          borderColor: 'rgba(0, 255, 0, 0.5)',
        },
      ];
    },
  },
  methods: {
    getSimplePrediction(timeline) {
      let lastValue = parseInt(timeline[timeline.length - 1], 10);
      const prediction = [];
      for (let i = 0; i < timeline.length - 1; i += 1) {
        prediction.push(null);
      }
      for (let i = 0; i < 300 - timeline.length; i += 1) {
        prediction.push(lastValue);
        lastValue += Math.round(lastValue * ((this.rValue - 50) / 1000));
      }
      return prediction;
    },
  },
};
</script>

<style>
</style>
