import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    toasters: [],
  },
  mutations: {
    setAuthToken: (state, token) => {
      localStorage.setItem('token', token);
      state.token = token;
    },
    setToasters: (state, toaster) => {
      state.toasters.push(toaster);
    },
    unsetToasters: (state) => {
      state.toasters.shift();
    },
  },
  actions: {
    addToaster: ({ commit }, payload) => {
      commit('setToasters', payload);
      function timeout() {
        setTimeout(() => {
          commit('unsetToasters');
        }, 3000);
      }
      timeout();
    },
  },
  modules: {
  },
});
