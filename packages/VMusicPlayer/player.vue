<template>
  <v-fade-transition>
    <div id="v-player" class="v-player" :class="classes" v-show="show">
      <v-card
        style="text-align: center"
        :flat="flat == undefined || flat == false ? false : true"
        tile
      >
        <v-progress-linear
          v-if="$vuetify.breakpoint.smAndDown"
          @click.native="setPosition()"
          v-model="percentage"
          :buffer-value="bufferPercentage"
          height="2"
          :stream="stream && localStream && !loading"
          :indeterminate="loading"
          :disabled="!loaded"
        ></v-progress-linear>
        <v-card-text>
          <v-row align="center" justify="space-between">
            <v-col md="4" sm="8">
              <div class="d-flex justify-start">
                <v-avatar rounded :size="$vuetify.breakpoint.mdAndUp ? 60 : 48">
                  <v-img :src="songInfo.avatarSrc"></v-img>
                </v-avatar>
                <div class="d-flex-column ml-3 text-start my-auto">
                  <div class="font-weight-bold">{{ songInfo.title }}</div>
                  <div>{{ songInfo.authors.join('/') }}</div>
                </div>
              </div>
            </v-col>
            <v-col md="4" class="d-flex justify-center">
              <slot name="centerLeading" />
              <!-- 上一首 -->
              <v-btn
                icon
                :color="color"
                @click="preSong"
                :disabled="historyPlaylistItems.length === 0"
                x-large
              >
                <v-icon>mdi-skip-previous</v-icon>
              </v-btn>
              <!-- 播放/暂停 -->
              <v-btn
                :outlined="$vuetify.breakpoint.mdAndUp"
                icon
                :color="color"
                @click.native="playing ? pause() : play()"
                :disabled="songInfo.fileSrc === null"
                x-large
              >
                <v-icon v-if="!playing">mdi-play</v-icon>
                <v-icon v-else>mdi-pause</v-icon>
              </v-btn>
              <!-- 下一首 -->
              <v-btn
                icon
                :color="color"
                @click="nextSong"
                :disabled="futurePlaylistItems.length === 0"
                x-large
              >
                <v-icon>mdi-skip-next</v-icon>
              </v-btn>
              <slot name="centerTrailing" />
            </v-col>
            <v-col
              v-if="$vuetify.breakpoint.mdAndUp"
              md="4"
              class="d-flex justify-end my-auto"
            >
              <v-slider
                v-if="!$vuetify.breakpoint.mobile"
                v-model="volume"
                :prepend-icon="isMuted ? 'mdi-volume-mute' : 'mdi-volume-high'"
                @click:prepend="mute"
                max="1"
                step="0.01"
                min="0"
                hide-details
              ></v-slider>
              <slot name="right" />
              <v-btn icon disabled>
                <v-icon>mdi-file-music</v-icon>
              </v-btn>
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
              <v-btn icon :color="color" @click="closePlayer">
                <v-icon>mdi-close-box</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-progress-linear
            v-if="$vuetify.breakpoint.mdAndUp"
            v-model="percentage"
            @click.native="setPosition()"
            :buffer-value="bufferPercentage"
            height="5"
            :stream="stream && localStream && !loading"
            :indeterminate="loading"
            :disabled="!loaded"
            class="my-3"
          ></v-progress-linear>
          <div v-if="$vuetify.breakpoint.mdAndUp">
            {{ currentTime }} / {{ duration }}
          </div>
        </v-card-text>

        <audio
          id="audio"
          ref="audio"
          :src="songInfo.fileSrc"
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
        :historyPlaylistItems="historyPlaylistItems"
        :futurePlaylistItems="futurePlaylistItems"
        @replay="replay"
        @playInAdvance="playInAdvance"
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
import store from '../store';
import { SongInfo } from '../store/modules/player';

const formatTime = (second: number) =>
  new Date(second * 1000).toISOString().substr(11, 8);

export default Vue.extend({
  name: 'v-music-player',
  mixins: [Themeable],
  components: {
    PlaylistDrawer,
  },
  model: {
    prop: 'show',
    event: 'change',
  },
  props: {
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
    // nowPlayingSong(): SongInfo {
    //   return {
    //     avatarSrc: this.localAvatarSrc,
    //     title: this.localTitle,
    //     authors: this.localAuthors as string[],
    //     duration: formatTime(this.totalDuration),
    //     fileSrc: this.localFileSrc,
    //   };
    // },
    songInfo(): SongInfo {
      return store.getters['_vuetifyMusicPlayer/songInfo'];
    },
    futurePlaylistItems: {
      get: () => {
        return store.getters['_vuetifyMusicPlayer/futurePlaylistItems'];
      },
    },
    historyPlaylistItems: {
      get: () => {
        return store.getters['_vuetifyMusicPlayer/historyPlaylistItems'];
      },
    },
  },
  data() {
    return {
      // 歌曲信息
      // localAvatarSrc: '',
      // localTitle: '',
      // localAuthors: [] as string[],
      // localFileSrc: '',

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
      needHistoryFlag: true,
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
    // 必须要watch，如果光根据store里的值，将无法判断
    songInfo(newValue, oldValue) {
      this.audio.autoplay = true;
      if (!this.show) this.$emit('change', true);
      if (oldValue.fileSrc !== null && this.loaded && this.needHistoryFlag)
        store.dispatch('_vuetifyMusicPlayer/add2HistoryList', {
          ...oldValue,
          duration: formatTime(this.totalDuration),
        });
      // this.playSong(newValue);
      this.needHistoryFlag = true;
    },
  },
  methods: {
    preSong() {
      this.needHistoryFlag = false;
      // this.play();
      if (this.percentage < 1) {
        store.dispatch('_vuetifyMusicPlayer/switch2Pre');

        // const song = ((this
        //   .historyPlaylistItems as unknown) as SongInfo[]).shift() as SongInfo;
        // ((this.futurePlaylistItems as unknown) as SongInfo[]).unshift(
        //   this.nowPlayingSong
        // );
        // this.playSong(song);
      } else {
        this.audio.currentTime = 0;
      }
    },
    nextSong() {
      // const song = ((this
      //   .futurePlaylistItems as unknown) as SongInfo[]).shift() as SongInfo;
      // ((this.historyPlaylistItems as unknown) as SongInfo[]).unshift(
      //   this.nowPlayingSong
      // );
      // this.playSong(song);
      store.dispatch('_vuetifyMusicPlayer/switch2Next');
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
      if (
        this.songInfo.fileSrc == null &&
        this.futurePlaylistItems.length > 0
      ) {
        this.nextSong();
      }
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
      // window.open(this.fileSrc, 'download');
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
      // const song = ((this
      //   .historyPlaylistItems as unknown) as SongInfo[]).splice(index, 1)[0];
      // ((this.historyPlaylistItems as unknown) as SongInfo[]).unshift(
      //   this.nowPlayingSong
      // );
      // this.playSong(song);
      store.dispatch('_vuetifyMusicPlayer/replay', index);
      this.audio.autoplay = true;
      this.$emit('didReplay', true);
    },
    /// 插播某个歌曲
    playInAdvance(index: number) {
      store.dispatch('_vuetifyMusicPlayer/playInAdvance', index);
      // this.playSong(song);
      this.audio.autoplay = true;
      this.$emit('playInAdvance', true);
    },
    /// 播放歌曲
    // playSong(song: SongInfo) {
    //   if (!this.show) this.$emit('change', true);
    //   this.audio.currentTime = 0;
    //   this.localAvatarSrc = song.avatarSrc;
    //   this.localTitle = song.title;
    //   this.localAuthors = song.authors;
    //   this.localFileSrc = `${song.fileSrc}?t=+${Math.random()}`;
    //   this.loaded = false;
    //   this.loading = true;
    //   this.stop();
    // },
    closePlayer() {
      this.stop();
      this.$emit('change', false);
    },

    /// listener
    handleCanPlay() {
      this.loading = false;
    },
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
          };
        } else {
          this.totalDuration = audio.duration;
        }
        this.loaded = true;
        this.loading = false;
        // store.dispatch(
        //   '_vuetifyMusicPlayer/setNowPlayingSongDuration',
        //   this.duration
        // );
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
