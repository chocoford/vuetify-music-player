<template>
  <v-fade-transition>
    <div id="v-player" class="v-player" :class="classes" v-show="show">
      <v-card
        style="text-align: center"
        :flat="flat == undefined || flat == false ? false : true"
      >
        <v-card-text>
          <v-row align="center" justify="space-between">
            <v-col md="4">
              <div class="d-flex justify-start">
                <v-avatar rounded size="60">
                  <v-img src="https://picsum.photos/200?random"></v-img>
                </v-avatar>
                <div class="d-flex-column ml-3 text-start my-auto">
                  <div class="font-weight-bold">{{ title }}</div>
                  <div>{{ authors.join('/') }}</div>
                </div>
              </div>
            </v-col>
            <v-col md="4">
              <div class="d-flex justify-center">
                <slot name="centerLeft" />
                <v-btn
                  icon
                  class="ma-2 my-auto"
                  :color="color"
                  @click="preSong"
                  x-large
                >
                  <v-icon>mdi-skip-previous</v-icon>
                </v-btn>
                <v-btn
                  outlined
                  icon
                  class="ma-2 my-auto"
                  :color="color"
                  @click.native="playing ? pause() : play()"
                  x-large
                >
                  <v-icon v-if="!playing">mdi-play</v-icon>
                  <v-icon v-else>mdi-pause</v-icon>
                </v-btn>
                <v-btn
                  icon
                  class="ma-2 my-auto"
                  :color="color"
                  @click="nextSong"
                  x-large
                >
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
                <slot name="centerRight" />
              </div>
            </v-col>
            <v-col md="4">
              <div class="d-flex justify-start my-auto">
                <v-slider
                  v-model="volume"
                  :prepend-icon="
                    isMuted ? 'mdi-volume-mute' : 'mdi-volume-high'
                  "
                  @click:prepend="mute"
                  max="1"
                  step="0.01"
                  min="0"
                  hide-details
                ></v-slider>
                <v-btn icon @click="playlist = !playlist">
                  <v-icon>mdi-playlist-play</v-icon>
                </v-btn>
                <v-btn
                  icon
                  :color="color"
                  @click.native="loaded ? download() : reload()"
                  v-if="loaded && downloadable"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
                <v-btn icon :color="color" @click="$emit('change', false)">
                  <v-icon>mdi-close-box</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-progress-linear
            v-model="percentage"
            :buffer-value="bufferPercentage"
            height="5"
            style="margin-top: 15px; margin-bottom: 15px"
            @click.native="setPosition()"
            :disabled="!loaded"
            :stream="stream"
          ></v-progress-linear>
          <div>{{ currentTime }} / {{ duration }}</div>
        </v-card-text>

        <audio
          id="audio"
          ref="audio"
          v-on:ended="ended"
          v-on:canplay="canPlay"
          :src="file"
        ></audio>
      </v-card>
      <playlist-drawer
        :drawer.sync="playlist"
        :historyPlayListItems="historyPlayListItems"
        @replay="replay"
      />
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from 'vue';
import PlaylistDrawer from './Playlist/index.vue';

// Styles
import '../styles/VPlayer.scss';

type PlaylistItem = {
  title: String;
  authors: Array<String>;
  duration: String;
  src: String;
};

const formatTime = (second: number) =>
  new Date(second * 1000).toISOString().substr(11, 8);

export default Vue.extend({
  name: 'VuetifyPlayer',
  components: {
    PlaylistDrawer,
  },
  model: {
    prop: 'show',
    event: 'change',
  },
  props: {
    // 歌曲信息
    title: String,
    authors: Array,
    file: {
      type: String,
      default: null,
    },
    // 播放器设置
    autoPlay: {
      type: Boolean,
      default: false,
    },
    ended: {
      type: Function,
      default: () => {},
    },
    canPlay: {
      type: Function,
      default: () => {},
    },
    color: {
      type: String,
      default: null,
    },
    downloadable: {
      type: Boolean,
      default: false,
    },
    stream: {
      type: Boolean,
      default: false,
    },
    historyPlaylistItemsInit: {
      type: Array,
      default: () => [] as PlaylistItem[],
    },

    // UI配置
    flat: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: true,
    },
    closeable: Boolean,
    bottom: Boolean,
    abosulte: Boolean,
    fixed: Boolean,
  },
  computed: {
    classes(): object {
      return {
        'v-player--bottom': this.bottom,
        'v-player--absolute': this.abosulte,
        'v-player--fixed': this.fixed,
      };
    },
    duration(): string {
      return formatTime(this.totalDuration);
    },
    audio(): HTMLAudioElement {
      return this.$refs.audio as HTMLAudioElement;
    },
  },
  data() {
    return {
      firstPlay: true,
      isMuted: false,
      loaded: false,
      playing: false,
      // paused: false,
      percentage: 0,
      bufferPercentage: 0,
      nowBufferedIndex: 0,
      currentTime: '00:00:00',
      totalDuration: 0,
      volume: 0.5,
      // 用来备份音量大小
      volumeBeforeMuted: 0.5,

      playlist: false,
      historyPlayListItems: this.historyPlaylistItemsInit as PlaylistItem[],
      // [
      //   {
      //     title: '玫瑰花的葬礼',
      //     authors: ['许嵩'],
      //     duration: '3:40',
      //   },
      //   {
      //     title: 'Hey KONG',
      //     authors: ['KEY.L 刘聪', '$CC731'],
      //     duration: '3:54',
      //   },
      //   {
      //     title: '阿司匹林',
      //     authors: ['王以太'],
      //     duration: '4:40',
      //   },
      // ],
    };
  },
  watch: {
    show(newValue) {
      if (newValue) {
        document
          .getElementById('app')!
          .style.setProperty('margin-bottom', '136px', 'important');
        // this.$nextTick(() => {
        //   this.$vuetify.goTo(165, {
        //     duration: 300,
        //     offset: 0,
        //     easing: 'easeInOutCubic',
        //   });
        // });
      } else {
        document
          .getElementById('app')!
          .style.setProperty('margin-bottom', '0', 'important');
        // this.$vuetify.goTo(-165, {
        //   duration: 300,
        //   offset: 0,
        //   easing: 'easeInOutCubic',
        // });
      }
    },
    volume(newValue) {
      if (newValue > 0) {
        this.audio.muted = false;
        this.isMuted = false;
        this.audio.volume = this.volume;
      } else {
        this.audio.muted = true;
        this.isMuted = true;
      }
    },
    file(oldValue) {
      /// handle playing
      this.stop();
      const playlistItem = {
        title: this.title,
        authors: this.authors,
        duration: '4:30',
        src: oldValue,
      } as PlaylistItem;
      this.historyPlayListItems.unshift(playlistItem);
      this.audio.autoplay = true;
    },
  },
  methods: {
    setPosition() {
      this.audio.currentTime = (this.audio.duration / 100) * this.percentage;
    },
    stop() {
      this.audio.pause();
      // this.paused = true;
      this.playing = false;
      this.audio.currentTime = 0;
    },
    play() {
      if (this.playing) return;
      this.audio.play().then(() => {
        this.playing = true;
      });
      // this.paused = false;
    },
    pause() {
      // this.paused = !this.paused;
      if (!this.playing) return;
      this.audio.pause();
      this.playing = false;

      // if (this.paused) {
      //   this.audio.pause();
      // } else {
      //   this.audio.play();
      // }
    },
    download() {
      // this.audio.pause();
      window.open(this.file, 'download');
    },
    mute() {
      this.isMuted = !this.isMuted;
      this.audio.muted = this.isMuted;
      if (this.isMuted) {
        this.volumeBeforeMuted = this.volume;
        this.volume = 0;
      } else {
        this.volume = this.volumeBeforeMuted;
      }
    },
    reload() {
      this.audio.load();
    },
    preSong() {},
    nextSong() {},

    handleLoaded() {
      const audio = this.$refs.audio as HTMLAudioElement;
      if (audio.readyState >= 2) {
        if (audio.duration === Infinity) {
          audio.currentTime = 1e101;
          audio.ontimeupdate = () => {
            audio.ontimeupdate = () => {};
            audio.currentTime = 0;
            this.totalDuration = (this.$refs
              .audio as HTMLAudioElement).duration;
            this.loaded = true;
          };
        } else {
          this.totalDuration = audio.duration;
          this.loaded = true;
        }
        if (this.autoPlay) audio.play();
      } else {
        throw new Error('Failed to load sound file');
      }
    },
    handlePlayingUI() {
      if (this.playing) return;
      const audio = this.$refs.audio as HTMLAudioElement;
      this.percentage = (audio.currentTime / audio.duration) * 100;
      this.bufferPercentage =
        (audio.buffered.end(this.nowBufferedIndex) / audio.duration) * 100;
      this.currentTime = formatTime(audio.currentTime);

      // this.playing = true;
    },
    handleSeeked() {
      const aduio = this.$refs.audio as HTMLAudioElement;
      // 每次seeked的时候都要检查，当下currentTime在buffered中的哪个位置。
      for (let i = 0; i < aduio.buffered.length; i += 1) {
        if (
          aduio.currentTime > aduio.buffered.start(i) &&
          aduio.currentTime < aduio.buffered.end(i)
        )
          this.nowBufferedIndex = i;
      }
    },
    handlePlayPause(e: Event) {
      const audio = this.$refs.audio as HTMLAudioElement;
      if (e.type === 'play' && this.firstPlay) {
        audio.currentTime = 0;
        if (this.firstPlay) {
          this.firstPlay = false;
        }
      }
      if (
        e.type === 'pause' &&
        // this.paused === false &&
        this.playing === false
      ) {
        this.currentTime = '00:00:00';
      }
    },
    handleEnded() {
      // this.paused = this.playing === false;
    },
    // handleKeydown(e: KeyboardEvent) {
    //   console.log(e.key);
    // },
    init() {
      this.audio.addEventListener('timeupdate', this.handlePlayingUI);
      this.audio.addEventListener('seeked', this.handleSeeked);
      this.audio.addEventListener('loadeddata', this.handleLoaded);
      this.audio.addEventListener('pause', this.handlePlayPause);
      this.audio.addEventListener('play', this.handlePlayPause);
      this.audio.addEventListener('ended', this.handleEnded);

      // document.getElementById('v-player')!.addEventListener('keydown', this.handleKeydown)
      // this.audio.addEventListener('keydown', this.handleKeydown);
    },
    replay(index: number) {
      const songs = this.historyPlayListItems.splice(index, 1);
      this.historyPlayListItems.unshift(songs[0]);
      // this.
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.audio.removeEventListener('timeupdate', this.handlePlayingUI);
    this.audio.removeEventListener('loadeddata', this.handleLoaded);
    this.audio.removeEventListener('pause', this.handlePlayPause);
    this.audio.removeEventListener('play', this.handlePlayPause);
    this.audio.removeEventListener('ended', this.handleEnded);
  },
});
</script>
