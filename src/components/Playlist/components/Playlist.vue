<template>
  <v-list>
    <v-list-item
      v-for="(item, index) in listItems"
      :key="`item.title-${index}`"
      :style="
        index % 2 === 0
          ? $vuetify.theme.light
            ? `background: #dddddd`
            : `background: #212121`
          : ''
      "
      @click="$emit('play', index)"
    >
      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>{{ item.authors.join('/') }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-content>
        <v-list-item-title>{{ item.duration }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Playlist',
  props: {
    listItems: {
      type: Array,
      default: () => [],
    },
  },
});
</script>
