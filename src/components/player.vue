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
                  <v-img :src="localAvatarSrc"></v-img>
                </v-avatar>
                <div class="d-flex-column ml-3 text-start my-auto">
                  <div class="font-weight-bold">{{ localTitle }}</div>
                  <div>{{ localAuthors.join('/') }}</div>
                </div>
              </div>
            </v-col>
            <v-col md="4">
              <div class="d-flex justify-center">
                <slot name="centerLeading" />
                <!-- 上一首 -->
                <v-btn
                  icon
                  class="ma-2 my-auto"
                  :color="color"
                  @click="preSong"
                  x-large
                >
                  <v-icon>mdi-skip-previous</v-icon>
                </v-btn>
                <!-- 播放/暂停 -->
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
                <!-- 下一首 -->
                <v-btn
                  icon
                  class="ma-2 my-auto"
                  :color="color"
                  @click="nextSong"
                  :disabled="futurePlaylistItems.length === 0"
                  x-large
                >
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
                <slot name="centerTrailing" />
              </div>
            </v-col>
            <v-col md="4" class="d-flex justify-start my-auto">
              <v-slider
                v-model="volume"
                :prepend-icon="isMuted ? 'mdi-volume-mute' : 'mdi-volume-high'"
                @click:prepend="mute"
                max="1"
                step="0.01"
                min="0"
                hide-details
              ></v-slider>
              <v-btn icon disabled>
                <v-icon>mdi-file-music</v-icon>
              </v-btn>
              <slot name="right" />
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
            </v-col>
          </v-row>
          <v-progress-linear
            v-model="percentage"
            :buffer-value="bufferPercentage"
            height="5"
            style="margin-top: 15px; margin-bottom: 15px"
            @click.native="setPosition()"
            :disabled="!loaded"
            :stream="stream && localStream && !loading"
            :indeterminate="loading"
          ></v-progress-linear>
          <div>{{ currentTime }} / {{ duration }}</div>
        </v-card-text>

        <audio
          id="audio"
          ref="audio"
          :src="localFileSrc"
          @progress="localStream = true"
          @canplay="handleCanPlay"
          @loadeddata="handleLoaded"
          @playing="playing = true"
          @pause="playing = false"
          @timeupdate="handlePlayingUI"
          @seeked="handleSeeked"
        ></audio>
      </v-card>
      <playlist-drawer
        :drawer.sync="playlist"
        :historyPlayListItems="historyPlayListItems"
        :futurePlaylistItems="localFuturePlaylistItems"
        @replay="replay"
        @cutIn="cutIn"
      />
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Themeable from 'vuetify/lib/mixins/themeable';
import PlaylistDrawer from './Playlist/index.vue';

// Styles
import '../styles/VPlayer.scss';

type PlaylistItem = {
  avatarSrc: string;
  title: string;
  authors: Array<string>;
  duration: string;
  fileSrc: string;
};

const formatTime = (second: number) =>
  new Date(second * 1000).toISOString().substr(11, 8);

export default Vue.extend({
  name: 'VuetifyPlayer',
  mixins: [Themeable],
  components: {
    PlaylistDrawer,
  },
  model: {
    prop: 'show',
    event: 'change',
  },
  props: {
    // 歌曲信息
    avatarSrc: String,
    title: String,
    authors: Array,
    fileSrc: {
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
    downloadable: {
      type: Boolean,
      default: false,
    },
    futurePlaylistItems: {
      type: Array,
      default: () => [] as PlaylistItem[],
    },
    historyPlaylistItemsInit: {
      type: Array,
      default: () => [] as PlaylistItem[],
    },

    // UI配置
    color: {
      type: String,
      default: null,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    stream: {
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
      // 歌曲信息
      localAvatarSrc: this.avatarSrc,
      localTitle: this.title,
      localAuthors: this.authors,
      localFileSrc: this.fileSrc,

      firstPlay: true,
      isMuted: false,
      loading: false,
      loaded: false,
      playing: false,

      localStream: false,
      percentage: 0,
      bufferPercentage: 0,
      nowBufferedIndex: 0,
      currentTime: '00:00:00',
      totalDuration: 0,
      volume: 0.5,
      // 用来备份音量大小
      volumeBeforeMuted: 0.5,

      playlist: false,
      localFuturePlaylistItems: this.futurePlaylistItems as PlaylistItem[],
      historyPlayListItems: this.historyPlaylistItemsInit as PlaylistItem[],
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
    fileSrc(oldValue) {
      const song = {
        avatarSrc: this.avatarSrc,
        title: this.title,
        authors: this.authors,
        duration: '',
        fileSrc: oldValue,
      } as PlaylistItem;
      this.playSong(song);
      this.audio.autoplay = true;
    },
    localFileSrc() {
      console.log('localFileSrc did Changed.');
      this.loaded = false;
      this.loading = true;
      this.stop();
    },
    loaded(newValue) {
      if (newValue) {
        console.log('loaded.');

        /// add to history list.
        this.historyPlayListItems.unshift({
          avatarSrc: this.localAvatarSrc,
          title: this.localTitle,
          authors: this.localAuthors,
          duration: formatTime(this.totalDuration),
          fileSrc: this.localFileSrc,
        });
        /// stop loading
        this.loading = false;
      }
    },
  },
  methods: {
    preSong() {
      if (this.percentage < 1) {
        this.replay(1);
      } else {
        this.replay(0);
      }
    },
    nextSong() {
      const song = this.localFuturePlaylistItems.shift() as PlaylistItem;
      this.playSong(song);
    },
    setPosition() {
      this.audio.currentTime = (this.audio.duration / 100) * this.percentage;
    },
    stop() {
      this.audio.pause();
      this.playing = false;
      this.audio.currentTime = 0;
    },
    play() {
      if (this.playing) return;
      this.audio.play().then(() => {
        this.playing = true;
      });
    },
    pause() {
      if (!this.playing) return;
      this.audio.pause();
      this.playing = false;
    },
    download() {
      // this.audio.pause();
      window.open(this.fileSrc, 'download');
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
    /// 重播某个歌曲
    replay(index: number) {
      if (index === 0) {
        this.audio.currentTime = 0;
      } else {
        const song = this.historyPlayListItems.splice(index, 1)[0];
        this.playSong(song);
        this.audio.autoplay = true;
        this.$emit('replay', song);
      }
    },
    /// 插播某个歌曲
    cutIn(index: number) {
      const song = this.localFuturePlaylistItems.splice(index, 1)[0];
      this.playSong(song);
      this.audio.autoplay = true;
      this.$emit('cutIn', song);
    },
    /// 播放歌曲
    playSong(song: PlaylistItem) {
      // console.log('playSong');
      this.audio.currentTime = 0;
      this.localAvatarSrc = song.avatarSrc;
      this.localTitle = song.title;
      this.localAuthors = song.authors;
      this.localFileSrc = `${song.fileSrc}?t=+${Math.random()}`;
    },

    /// listener
    handleCanPlay() {
      this.loading = false;
    },
    handleLoaded() {
      console.log('handleLoadded');
      const audio = this.$refs.audio as HTMLAudioElement;
      if (audio.readyState >= 2) {
        if (audio.duration === Infinity) {
          audio.currentTime = 1e101;
          audio.ontimeupdate = () => {
            audio.ontimeupdate = () => {};
            audio.currentTime = 0;
            this.totalDuration = (this.$refs
              .audio as HTMLAudioElement).duration;
          };
        } else {
          this.totalDuration = audio.duration;
        }
        this.loaded = true;
        if (this.autoPlay) audio.play();
      } else {
        throw new Error('Failed to load sound file');
      }
    },
    handlePlayingUI() {
      if (!this.playing) return;
      const audio = this.$refs.audio as HTMLAudioElement;
      this.percentage = (audio.currentTime / audio.duration) * 100;
      this.bufferPercentage =
        (audio.buffered.end(this.nowBufferedIndex) / audio.duration) * 100;
      this.currentTime = formatTime(audio.currentTime);
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
  },
});
</script>
