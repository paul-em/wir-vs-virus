<template>
  <section class="text-center p-16 min-w-l">
    <header class="flex justify-between items-center flex-column md:flex-row">
      <hackathon-logo/>
      <app-logo/>
    </header>
    <div class="pt-8">
      <div class="flex justify-center">
        <div class="inline-block min-w-s p-4">
          {{ $t('label.region') }}
          <v-select
            v-model="selectedArea"
            :options="areaOptions"/>
        </div>
        <div class="inline-block min-w-s p-4">
          {{ $t('label.language') }}
          <LanguagePicker/>
        </div>
      </div>
    </div>
    <github-corner url="https://github.com/paul-em/wir-vs-virus"/>
    <div class="pt-8">
      <div class="py-4">
        <v-slider
          :min="0"
          :max="100"
          :dot-size="28"
          v-model="rValue"
          tooltip="none"
          lazy/>
        <measures-view :r-value="rValue"/>
      </div>
      <div>
        <div class="p-4 flex justify-center">
          <kpi-card
            :value="prediction.totalInfected"
            :worst-case-value="worstCasePrediction.totalInfected"
            :label="this.$t('label.infected')"
            img="maxinfect.png"/>
          <kpi-card
            :value="prediction.totalDeaths"
            :worst-case-value="worstCasePrediction.totalDeaths"
            :label="this.$t('label.deaths')"
            img="deaths.png"/>
        </div>
      </div>
    </div>
    <div>
      <div v-if="showAll">
        <line-chart
          v-if="selectedArea"
          :datasets="[datasets['infected'], datasets['infected_prediction'], datasets['deaths'], datasets['deaths_prediction']]"
          :labels="dates"
          :max-value="population"/>
      </div>
      <div v-else>
        Infected
        <line-chart
          v-if="selectedArea"
          :datasets="[datasets['infected'], datasets['infected_prediction']]"
          :labels="dates"
          :max-value="population"/>
        Deaths
        <line-chart
          v-if="selectedArea"
          :datasets="[datasets['deaths'], datasets['deaths_prediction']]"
          :labels="dates"
          :max-value="population"/>
      </div>
      <button
        class="p-3 my-2 text-sm hover:bg-grey-lighter rounded-sm uppercase"
        @click="showAll = !showAll">
        {{ showAll ? $t('label.show-separate') : $t('label.show-combined') }}
      </button>
    </div>
    <disclaimer-page/>
  </section>
</template>

<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import vSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import LineChart from '../components/LineChart.vue';
import KpiCard from '../components/KpiCard.vue';
import HackathonLogo from '../components/HackathonLogo.vue';
import AppLogo from '../components/AppLogo.vue';
import GithubCorner from '../components/GithubCorner.vue';
import MeasuresView from '../components/MeasuresView.vue';
import DisclaimerPage from '../components/DisclaimerPage.vue';
import LanguagePicker from '../components/LanguagePicker.vue';
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
      cases: await $loader.loadCases(),
      measures: await $loader.loadMeasures(),
    };
  },
  components: {
    LineChart,
    KpiCard,
    vSelect,
    vSlider,
    HackathonLogo,
    GithubCorner,
    MeasuresView,
    DisclaimerPage,
    AppLogo,
    LanguagePicker,
  },
  data() {
    const initalArea = { label: this.$t('Germany'), key: 'Germany' };
    return ({
      cases: [],
      measures: [],
      selectedArea: initalArea,
      rValue: 50,
      showAll: true,
    });
  },
  computed: {
    population() {
      if (this.selectedArea) {
        return populations[this.selectedArea.key];
      }
      return [];
    },
    areaOptions() {
      const areas = [];
      const missingPopulations = [];
      this.cases.forEach((item) => {
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
      // translate areas
      const areasTranslated = areas.map(e => ({ label: this.$t(e), key: e }));
      return areasTranslated;
    },
    areaCases() {
      const areaKey = this.selectedArea ? this.selectedArea.key : '';
      const items = this.cases
        .filter(item => item.area && item.area.includes(areaKey));
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
    areaMeasures() {
      return this.measures;
    },
    dates() {
      const dates = [];
      for (let day = 0; day < 200; day += 1) {
        dates.push(formatDate(new Date(2020, 0, 22 + day)));
      }
      return dates;
    },
    daySinceOutbreak() {
      return this.areaCases.infected.filter(item => !!item).length;
    },
    currentlyInfected() {
      let latestInfected = 0;
      this.areaCases.infected.forEach((infected) => {
        if (infected !== null) {
          latestInfected = infected;
        }
      });
      return latestInfected;
    },
    currentlyDeaths() {
      let latestDeaths = 0;
      this.areaCases.deaths.forEach((deaths) => {
        if (deaths !== null) {
          latestDeaths = deaths;
        }
      });
      return latestDeaths;
    },
    prediction() {
      return this.$predict({
        rValue: this.rValue,
        population: this.population,
        day: this.daySinceOutbreak,
        initiallyInfected: this.currentlyInfected,
        initiallyDeaths: this.currentlyDeaths,
      });
    },
    worstCasePrediction() {
      return this.$predict({
        rValue: 100,
        population: this.population,
        day: this.daySinceOutbreak,
        initiallyInfected: this.currentlyInfected,
        initiallyDeaths: this.currentlyDeaths,
      });
    },
    deaths() {
      return this.prediction.timelines[this.prediction.timelines.length - 1].deaths;
    },
    datasets() {
      return {
        infected: {
          label: this.$t('label.infected'),
          data: this.areaCases.infected,
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          borderColor: 'rgba(0, 0, 255, 0.8)',
        },
        infected_prediction: {
          label: this.$t('label.infected-prediction'),
          data: this.align(
            this.areaCases.infected,
            this.prediction.timelines.map(item => item.infected),
          ),
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          borderColor: 'rgba(0, 0, 255, 0.2)',
        },
        deaths: {
          label: this.$t('label.deaths'),
          data: this.areaCases.deaths,
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          borderColor: 'rgba(255, 0, 0, 0.8)',
        },
        deaths_prediction: {
          label: this.$t('label.deaths-prediction'),
          data: this.align(
            this.areaCases.deaths,
            this.prediction.timelines.map(item => item.deaths),
          ),
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          borderColor: 'rgba(255, 0, 0, 0.2)',
        },
      };
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
    align(actual, predicted) {
      const index = actual.findIndex(item => item === null);
      const offset = [];
      for (let i = 0; i < index - 1; i += 1) {
        offset.push(null);
      }
      return [
        ...offset,
        ...predicted,
      ];
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
