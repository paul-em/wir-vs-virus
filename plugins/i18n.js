/* eslint-disable no-param-reassign */
/* eslint-disable global-require */

import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export default ({ app }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: (navigator.language || navigator.userLanguage).slice(0, 2),
    fallbackLocale: 'en',
    messages: {
      en: require('../static/content-en.json'),
      de: require('../static/content-de.json'),
    },
    // Lots of strings have no translation (e.g. countries)
    // so don't spam the console with warnings
    silentTranslationWarn: true,
  });
};
