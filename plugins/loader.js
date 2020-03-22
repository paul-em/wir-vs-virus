import csvParser from 'papaparse';

const dataSourceConfirmed = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';
const dataSourceDeaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv';
const dataSourceRecovered = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv';
const corsProxy = 'https://nameless-shadow-474c.cors-everywhere.workers.dev/?';

const dataLake = 'https://bene.gridpiloten.de:4712/api';

const loadCasesFromDataLake = false;

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


export default ({ $axios }, inject) => {
  inject('loader', {
    async loadMeasures() {
      try {
        const re = await $axios.get(`${dataLake}/measures`);
        return re.data;
      } catch (err) {
        console.log('error loading measures', err);
        return [];
      }
    },
    async loadCases() {
      if (loadCasesFromDataLake) {
        const re = await $axios.get(`${dataLake}/cases`);
        return re.data;
      }
      let confirmedRaw;
      let deathsRaw;
      let recoveredRaw;
      try {
        [confirmedRaw, deathsRaw, recoveredRaw] = await Promise.all([
          $axios.get(dataSourceConfirmed),
          $axios.get(dataSourceDeaths),
          $axios.get(dataSourceRecovered),
        ]);
      } catch (err) {
        [confirmedRaw, deathsRaw, recoveredRaw] = await Promise.all([
          $axios.get(corsProxy + dataSourceConfirmed),
          $axios.get(corsProxy + dataSourceDeaths),
          $axios.get(corsProxy + dataSourceRecovered),
        ]);
      }

      const rawData = {
        infected: csvParser.parse(confirmedRaw.data, {
          header: true,
          skipEmptyLines: true,
        }).data,
        deaths: csvParser.parse(deathsRaw.data, {
          header: true,
          skipEmptyLines: true,
        }).data,
        recovered: csvParser.parse(recoveredRaw.data, {
          header: true,
          skipEmptyLines: true,
        }).data,
      };
      const items = [];
      rawData.infected.forEach((item, index) => {
        const deaths = rawData.deaths[index];
        const recovered = rawData.recovered[index];
        Object.keys(item)
          .filter(i => ![
            'Province/State',
            'Country/Region',
            'Lat',
            'Long',
          ].includes(i))
          .forEach((day) => {
            const currentDeaths = parseInt(deaths[day] || 0, 10);
            const currentRecovered = parseInt(recovered[day] || 0, 10);
            const notInfected = currentDeaths + currentRecovered;
            items.push({
              area: [item['Province/State'], item['Country/Region']].filter(v => !!v),
              date: formatDate(day),
              infected: parseInt(item[day] || 0, 10) - notInfected,
              deaths: currentDeaths,
              recovered: currentRecovered,
            });
          });
      });
      return items;
    },
  });
};
