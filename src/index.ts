import { VueConstructor } from 'vue';
import * as components from './components';

const install = (vue: VueConstructor) => {
  if ((install as any).installed) return;
  (components as any).map((component: any) => {
    return vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
