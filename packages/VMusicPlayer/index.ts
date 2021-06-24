import { VueConstructor } from 'vue';
import VMusicPlayer from './player.vue';

// 为组件提供 install 安装方法，供按需引入
(VMusicPlayer as any).install = (Vue: VueConstructor) => {
  Vue.component(VMusicPlayer.name, VMusicPlayer);
};

export { VMusicPlayer };
export default VMusicPlayer;
