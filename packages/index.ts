import { VueConstructor } from 'vue';
import { VMusicPlayer } from './VMusicPlayer';

const components = [VMusicPlayer];

const install = (vue: VueConstructor) => {
  if ((install as any).installed) return;
  (components as any).map((component: any) => {
    return vue.component(component.name, component);
  });
};

// Auto-install when vue is found (eg. in browser via <script> tag)
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  VMusicPlayer,
};
