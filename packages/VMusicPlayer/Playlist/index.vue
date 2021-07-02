<template>
  <aside class="player-playlist player-playlist--fixed player-playlist--right">
    <v-slide-x-reverse-transition>
      <!-- card才有那个边边 -->
      <v-card v-show="drawer">
        <v-navigation-drawer
          style="min-width: 400px; min-height: 600px; max-height: 66vh"
        >
          <template v-slot:prepend>
            <v-container>
              <v-row align="center" justify="center">
                <v-tabs centered v-model="tab">
                  <v-tab>播放列表</v-tab>
                  <v-tab>历史记录</v-tab>
                </v-tabs>
                <v-btn
                  icon
                  @click="$emit('update:drawer', false)"
                  absolute
                  right
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </template>

          <v-divider></v-divider>

          <!-- 播放列表 -->
          <v-fade-transition mode="out-in">
            <playlist
              v-if="tab == 0"
              :listItems="futurePlaylistItems"
              @play="playInAdvance"
            />
            <playlist
              v-if="tab == 1"
              :listItems="historyPlaylistItems"
              @play="replay"
            />
          </v-fade-transition>
        </v-navigation-drawer>
      </v-card>
    </v-slide-x-reverse-transition>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue';
import Playlist from './components/Playlist.vue';

import '../../styles/PlaylistDrawer.scss';

export default Vue.extend({
  name: 'PlaylistDrawer',
  components: { Playlist },
  props: {
    drawer: Boolean,
    futurePlaylistItems: {
      type: Array,
      default: () => [],
    },
    historyPlaylistItems: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    tab: 0,
  }),
  methods: {
    replay(index: number) {
      this.$emit('replay', index);
    },
    playInAdvance(index: number) {
      this.$emit('playInAdvance', index);
    },
  },
});
</script>
