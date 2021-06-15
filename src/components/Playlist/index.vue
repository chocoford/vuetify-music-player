<template>
  <aside class="player-playlist player-playlist--fixed player-playlist--right">
    <!-- card才有那个边边 -->
    <v-slide-x-reverse-transition>
      <v-card v-show="drawer">
        <v-navigation-drawer
          style="min-width: 400px; min-height: 600px; max-height: 66vh"
        >
          <template v-slot:prepend>
            <v-container>
              <v-row align="center">
                <v-list-item-content>
                  <v-list-item-title>播放列表</v-list-item-title>
                </v-list-item-content>
                <!-- <v-spacer /> -->
                <v-btn icon @click="$emit('update:drawer', false)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-row>
            </v-container>
          </template>

          <v-divider></v-divider>

          <!-- 播放列表 -->
          <playlist :historyListItems="historyPlayListItems" @replay="replay" />
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
    historyPlayListItems: Array,
  },
  data: () => ({}),
  methods: {
    replay(index: number) {
      this.$emit('replay', index);
    },
  },
});
</script>
