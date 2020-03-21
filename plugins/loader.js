import mockData from './mock';

const dataSource = 'https://bene.gridpiloten.de:4712/api/cases';

export default ({ $axios }, inject) => {
  inject('loader', {
    async load() {
      try {
        const re = await $axios.get(dataSource);
        return re.data;
      } catch (err) {
        return mockData;
      }
    },
  });
};
