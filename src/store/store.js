import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    registeredIcons: false
  },
  mutations: {
    registeredIcon(state, flag) {
      state.registeredIcons = flag;
    }
  },
  getters: {
    registeredIcons: state => state.registeredIcons
  }
});
