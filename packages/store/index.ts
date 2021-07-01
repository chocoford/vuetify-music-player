import Vue from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import Vuex from 'vuex';
import _vuetifyMusicPlayer from './modules/player';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    _vuetifyMusicPlayer,
  },
});
