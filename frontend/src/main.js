import Vue from 'vue';

import App from '@frontend/App.vue';
import router from '@frontend/router';
import store from '@frontend/store';
import apolloProvider from '@frontend/apollo';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount('#app');
