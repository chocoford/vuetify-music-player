import { PluginFunction } from 'vue';

export interface VuetifyMusicPlayerObject {}

export interface VuetifyMusicPlayerUseOptions extends VuetifyMusicPlayerObject {
  property?: string;
}
export interface VuetifyMusicPlayerPlugin {
  install: PluginFunction<VuetifyMusicPlayerUseOptions>;
}

// declare const VuetifyToastPlugin: VuetifyToastPlugin;

export default VuetifyMusicPlayerPlugin;

interface VuetifyMusicPlayerShow {
  // eslint-disable-next-line no-unused-vars
  (message: string, options?: VuetifyMusicPlayerObject): void;
}

interface VuetifyMusicPlayerMethods extends VuetifyMusicPlayerShow {
  play: Function;
}

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-shadow
  export interface Vue {
    $player: VuetifyMusicPlayerMethods;
  }
}
