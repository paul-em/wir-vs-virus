import SeirModel from 'seir';

const covid19 = new SeirModel({
  r0: 2.2,
  dDeath: 32 - 2.9,
  dIncubation: 5.2,
  dInfectious: 2.9,
  dRecoveryMild: 14 - 2.9,
  dRecoveryServere: 31.5 - 2.9,
  dHospitalLag: 5,
  cfr: 0.02,
  pServere: 0.2,
  dt: 2,
});

export default (app, inject) => {
  inject('predict', ({ population, rValue }) => {
    const timelines = covid19.calculate({
      population,
      initiallyInfected: 1,
      r0ReductionPercent: 100 - rValue,
      r0ReductionDay: 96,
      days: 300,
    });
    const lastItem = timelines[timelines.length - 1];
    let maxInfected = 0;
    timelines.forEach((item) => {
      if (maxInfected < item.infected) {
        maxInfected = item.infected;
      }
    });
    console.log(timelines);
    return {
      totalInfected: lastItem.totalInfected,
      totalDeaths: lastItem.deaths,
      maxInfected,
      timelines,
    };
  });
};
