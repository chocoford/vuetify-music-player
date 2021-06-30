import { VueConstructor } from 'vue';
import store from './store';
import VMusicPlayer from './VMusicPlayer/player.vue';

// // const install = VMusicPlayer.install;

// VMusicPlayer.install = (Vue: VueConstructor, args: any = {}) => {
//   // eslint-disable-next-line no-param-reassign
//   Vue.prototype.$myMethod = (methodOptions) => {
//     // 逻辑...
//   };
// };

// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(VMusicPlayer);
// }

const install = (Vue: VueConstructor, globalOptions: any = {}) => {
  if ((install as any).installed) return;
  // eslint-disable-next-line no-unused-vars
  const property = globalOptions.property || '$player';
  Vue.component('VMusicPlayer', VMusicPlayer);
  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$player = {
    play: (songInfo: any) => {
      store.commit('player/changeSong', songInfo);
    },
    cutIn: () => {},
    appendSong: () => {},
    downlaod: () => {},
  };
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

export default { install };
