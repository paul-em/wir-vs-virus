/* eslint-disable max-len */
/* eslint-disable operator-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */

const Time_to_death = 32;
const I0 = 1;
const R0 = 2.2;
const D_incbation = 5.2;
const D_infectious = 2.9;
const D_recovery_mild = (14 - 2.9);
const D_recovery_severe = (31.5 - 2.9);

const D_hospital_lag = 5;
const D_death = Time_to_death - D_infectious;
const CFR = 0.02;
// const Time = 220;
// const Xmax = 110000;
const dt = 2;
const P_SEVERE = 0.2;
const duration = 7 * 12 * 1e10;

// f is a func of time t and state y
// y is the initial state, t is the time, h is the timestep
// updated y is returned.
const integrate = (m, f, y, t, h) => {
  for (var k = [], ki = 0; ki < m.length; ki++) {
    var _y = y.slice(); const
      dt = ki ? ((m[ki - 1][0]) * h) : 0;
    for (var l = 0; l < _y.length; l++) for (var j = 1; j <= ki; j++) _y[l] = _y[l] + h * (m[ki - 1][j]) * (k[ki - 1][l]);
    k[ki] = f(t + dt, _y, dt);
  }
  for (var r = y.slice(), l = 0; l < _y.length; l++) for (var j = 0; j < k.length; j++) r[l] = r[l] + h * (k[j][l]) * (m[ki - 1][j]);
  return r;
};

const Integrators = {
  Euler: [[1]],
  Midpoint: [[0.5, 0.5], [0, 1]],
  Heun: [[1, 1], [0.5, 0.5]],
  Ralston: [[2 / 3, 2 / 3], [0.25, 0.75]],
  K3: [[0.5, 0.5], [1, -1, 2], [1 / 6, 2 / 3, 1 / 6]],
  SSP33: [[1, 1], [0.5, 0.25, 0.25], [1 / 6, 1 / 6, 2 / 3]],
  SSP43: [[0.5, 0.5], [1, 0.5, 0.5], [0.5, 1 / 6, 1 / 6, 1 / 6], [1 / 6, 1 / 6, 1 / 6, 1 / 2]],
  RK4: [[0.5, 0.5], [0.5, 0, 0.5], [1, 0, 0, 1], [1 / 6, 1 / 3, 1 / 3, 1 / 6]],
  RK38: [[1 / 3, 1 / 3], [2 / 3, -1 / 3, 1], [1, 1, -1, 1], [1 / 8, 3 / 8, 3 / 8, 1 / 8]],
};

function getSolution(N, InterventionAmt, InterventionTime) {
  const interpolation_steps = 40;
  let steps = 310 * interpolation_steps;
  const _dt = dt / interpolation_steps;
  const sample_step = interpolation_steps;

  const method = Integrators.RK4;
  function f(t, x) {
    // SEIR ODE
    let beta;
    if (t > InterventionTime && t < InterventionTime + duration) {
      beta = (InterventionAmt) * R0 / (D_infectious);
    } else if (t > InterventionTime + duration) {
      beta = 0.5 * R0 / (D_infectious);
    } else {
      beta = R0 / (D_infectious);
    }
    const a = 1 / D_incbation;
    const gamma = 1 / D_infectious;

    const S = x[0]; // Susectable
    const E = x[1]; // Exposed
    const I = x[2]; // Infectious
    const Mild = x[3]; // Recovering (Mild)
    const Severe = x[4]; // Recovering (Severe at home)
    const Severe_H = x[5]; // Recovering (Severe in hospital)
    const Fatal = x[6]; // Recovering (Fatal)
    // const R_Mild = x[7]; // Recovered
    // const R_Severe = x[8]; // Recovered
    // const R_Fatal = x[9]; // Dead

    const p_severe = P_SEVERE;
    const p_fatal = CFR;
    const p_mild = 1 - P_SEVERE - CFR;

    const dS = -beta * I * S;
    const dE = beta * I * S - a * E;
    const dI = a * E - gamma * I;
    const dMild = p_mild * gamma * I - (1 / D_recovery_mild) * Mild;
    const dSevere = p_severe * gamma * I - (1 / D_hospital_lag) * Severe;
    const dSevere_H = (1 / D_hospital_lag) * Severe - (1 / D_recovery_severe) * Severe_H;
    const dFatal = p_fatal * gamma * I - (1 / D_death) * Fatal;
    const dR_Mild = (1 / D_recovery_mild) * Mild;
    const dR_Severe = (1 / D_recovery_severe) * Severe_H;
    const dR_Fatal = (1 / D_death) * Fatal;

    //      0   1   2   3      4        5          6       7        8          9
    return [dS, dE, dI, dMild, dSevere, dSevere_H, dFatal, dR_Mild, dR_Severe, dR_Fatal];
  }

  let v = [1, 0, I0 / (N - I0), 0, 0, 0, 0, 0, 0, 0];
  let t = 0;

  const P = [];
  const TI = [];
  const Iters = [];
  while (steps--) {
    if ((steps + 1) % (sample_step) === 0) {
      //    Dead   Hospital          Recovered        Infected   Exposed
      P.push([N * v[9], N * (v[5] + v[6]), N * (v[7] + v[8]), N * v[2], N * v[1]]);
      Iters.push(v);
      TI.push(N * (1 - v[0]));
    }
    v = integrate(method, f, v, t, _dt);
    t += _dt;
  }
  return {
    P,
    deaths: N * v[6],
    total: 1 - v[0],
    total_infected: TI,
    Iters,
    dIters: f,
  };
}


export default (app, inject) => {
  inject('predict', ({ population, rValue }) => {
    const solution = getSolution(population, rValue / 100, 96);
    //    Dead   Hospital          Recovered        Infected   Exposed
    const lastItem = solution.P[solution.P.length - 1];
    const Iter = solution.Iters[solution.Iters.length - 1];
    let maxInfected = 0;
    const timelines = solution.Iters.map((Iter) => {
      const infected = Math.round(population * Iter[2]);
      maxInfected = Math.max(maxInfected, infected);
      return {
        deaths: Math.round(population * Iter[9]),
        recovered: Math.round(population * (Iter[7] + Iter[8])),
        infected,
      };
    });
    return {
      ...solution,
      totalInfected: Math.round(population * (1 - Iter[0] - Iter[1] - Iter[2]) + I0),
      totalDeaths: Math.round(lastItem[0]),
      maxInfected,
      timelines,
    };
  });
};
