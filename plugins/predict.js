

export default (app, inject) => {
  inject('predict', {
    infections(timeline, { population, rValue, maxDays }) {
      console.log('predict infections for', timeline, population, rValue, maxDays);
      return [];
    },
    recovered(timeline, { population, rValue, maxDays }) {
      console.log('predict recovered for', timeline, population, rValue, maxDays);
      return [];
    },
    deaths(timeline, { population, rValue, maxDays }) {
      console.log('predict deaths for', timeline, population, rValue, maxDays);
      return [];
    },
  });
};
