<template>
  <section class="text-center p-16">
    <h3>Corona Virus</h3>
    <h1>
      What can <span class="font-black font-serif">I</span> do?
    </h1>
    <div class="pt-8">
      <v-select
        v-model="selectedArea"
        :options="areaOptions"/>
      <div class="py-4">
        <v-slider
          :min="0"
          :max="100"
          v-model="rValue"/>
        {{ rValue }}
      </div>
      <line-chart
        v-if="selectedArea"
        :datasets="datasets"
        :labels="dates"
        :max-value="population"/>
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
import populations from '../assets/populations';


function fill(num) {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
}

function formatDate(str) {
  const d = new Date(str);
  return `${d.getUTCFullYear()}-${fill(d.getUTCMonth() + 1)}-${fill(d.getUTCDate())}`;
}

export default {
  async asyncData({ app: { $loader } }) {
    return {
      data: await $loader.loadFromJHU(),
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
    selectedArea: 'China',
    rValue: 50,
  }),
  computed: {
    population() {
      return populations[this.selectedArea];
    },
    areaOptions() {
      const areas = [];
      const missingPopulations = [];
      this.data.forEach((item) => {
        if (item.area) {
          item.area.forEach((area) => {
            if (!areas.includes(area)) {
              if (!populations[area]) {
                if (!missingPopulations.includes(area)) {
                  missingPopulations.push(area);
                }
              } else {
                areas.push(area);
              }
            }
          });
        }
      });
      if (missingPopulations.length) {
        console.warn('no population data found for', missingPopulations);
      }
      return areas;
    },
    areaData() {
      const items = this.data
        .filter(item => item.area && item.area.includes(this.selectedArea));
      const infected = [];
      const recovered = [];
      const deaths = [];
      this.dates.forEach((date) => {
        const dateItems = items.filter(item => item.date === date);
        if (!dateItems.length) {
          infected.push(null);
          recovered.push(null);
          deaths.push(null);
        } else {
          let mergedDeaths = 0;
          let mergedInfected = 0;
          let mergedRecovered = 0;
          dateItems.forEach((item) => {
            mergedDeaths += parseInt(item.deaths, 10);
            mergedInfected += parseInt(item.infected, 10);
            mergedRecovered += parseInt(item.recovered, 10);
          });
          infected.push(mergedInfected);
          recovered.push(mergedRecovered);
          deaths.push(mergedDeaths);
        }
      });
      return {
        infected,
        recovered,
        deaths,
      };
    },
    dates() {
      const dates = [];
      for (let day = 0; day < 300; day += 1) {
        dates.push(formatDate(new Date(2020, 0, 22 + day)));
      }
      return dates;
    },
    datasets() {
      return [
        {
          label: 'Infected',
          data: this.areaData.infected,
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          borderColor: 'rgba(0, 0, 255, 0.8)',
        },
        {
          label: 'Infected Prediction',
          data: this.$predict.infections(this.areaData.infected, {
            maxDays: 300,
            rValue: this.rValue,
            population: this.population,
          }),
          backgroundColor: 'rgba(0, 0, 255, 0.01)',
          borderColor: 'rgba(0, 0, 255, 0.2)',
        },
        {
          label: 'Deaths',
          data: this.areaData.deaths,
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          borderColor: 'rgba(255, 0, 0, 0.8)',
        },
        {
          label: 'Deaths Prediction',
          data: this.$predict.deaths(this.areaData.deaths, {
            maxDays: 300,
            rValue: this.rValue,
            population: this.population,
          }),
          backgroundColor: 'rgba(255, 0, 0, 0.01)',
          borderColor: 'rgba(255, 0, 0, 0.2)',
        },
        {
          label: 'Recovered',
          data: this.areaData.recovered,
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          borderColor: 'rgba(0, 255, 0, 0.8)',
        },
        {
          label: 'Recovered Prediction',
          data: this.$predict.recovered(this.areaData.recovered, {
            maxDays: 300,
            rValue: this.rValue,
            population: this.population,
          }),
          backgroundColor: 'rgba(0, 255, 0, 0.01)',
          borderColor: 'rgba(0, 255, 0, 0.2)',
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
/*

      {
    "_id": "5e75fa9180efbf028f266e2d",
    "area": [
      "Hubei",
      "Mainland China"
    ],
    "date": 1583053999.0,
    "dead": "2761",
    "infected": "66907",
    "recovered": "31536",
    "source": "JHU"
  },
  */
</script>

<style>
</style>
