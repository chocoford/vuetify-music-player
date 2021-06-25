// import { VueConstructor } from 'vue';
// import VMusicPlayer from './VMusicPlayer';

// const components = [VMusicPlayer];

// const install = (vue: VueConstructor) => {
//   if ((install as any).installed) return;
//   (components as any).map((component: any) => {
//     return vue.component(component.name, component);
//   });
// };

// // Auto-install when vue is found (eg. in browser via <script> tag)
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }
// export { VMusicPlayer };

// export default {
//   install,
//   VMusicPlayer,
// };

import { VueConstructor } from 'vue';
import VMusicPlayer from './VMusicPlayer/player.vue';

const components = [VMusicPlayer];

const install = (Vue: VueConstructor, globalOptions: any = {}) => {
  if ((install as any).installed) return;
  // eslint-disable-next-line no-unused-vars
  const property = globalOptions.property || '$player';
  (components as any).map((component: any) => {
    return Vue.component(component.name, component);
  });
  // const manager = Vue.prototype[property];
  // manager.play =
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

// export default { install };
export default VMusicPlayer;
