import csvParser from 'papaparse'

const dataSourceConfirmed =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv'
const dataSourceDeaths =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv'
const dataSourceRecovered =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv'
const corsProxy = 'https://nameless-shadow-474c.cors-everywhere.workers.dev/?'

export default ({ $axios }, inject) => {
  inject('loader', {
    async load() {
      let confirmedRaw
      let deathsRaw
      let recoveredRaw
      try {
        ;[confirmedRaw, deathsRaw, recoveredRaw] = await Promise.all([
          $axios.get(dataSourceConfirmed),
          $axios.get(dataSourceDeaths),
          $axios.get(dataSourceRecovered)
        ])
      } catch (err) {
        ;[confirmedRaw, deathsRaw, recoveredRaw] = await Promise.all([
          $axios.get(corsProxy + dataSourceConfirmed),
          $axios.get(corsProxy + dataSourceDeaths),
          $axios.get(corsProxy + dataSourceRecovered)
        ])
      }

      const rawData = {
        confirmed: csvParser.parse(confirmedRaw.data, {
          header: true,
          skipEmptyLines: true
        }).data,
        deaths: csvParser.parse(deathsRaw.data, {
          header: true,
          skipEmptyLines: true
        }).data,
        recovered: csvParser.parse(recoveredRaw.data, {
          header: true,
          skipEmptyLines: true
        }).data
      }
      return rawData
    }
  })
}
