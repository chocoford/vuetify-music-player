/* eslint-disable no-param-reassign */
// Data
import Vue from 'vue';

export type SongInfo = {
  avatarSrc: string | null;
  title: string | null;
  authors: string[] | null;
  duration: string | null;
  fileSrc: string | null;
};

type PlayerState = {
  songInfo: SongInfo;
  historyPlaylistItems: SongInfo[];
  futurePlaylistItems: SongInfo[];
};

const state: PlayerState = {
  songInfo: {
    avatarSrc: null,
    fileSrc: null,
    authors: [],
    title: null,
    duration: '',
  },
  historyPlaylistItems: [],
  futurePlaylistItems: [],
};

const mutations = {
  changeSong(state_: PlayerState, payload: SongInfo) {
    state_.songInfo = payload;
  },
  setNowPlayingSongDuration(state_: PlayerState, duration: string) {
    Vue.set(state_.songInfo, 'duration', duration);
  },
  unshiftToFuturePlaylist(state_: PlayerState, song: SongInfo) {
    state_.futurePlaylistItems.unshift(song);
  },
  pushToFuturePlaylist(state_: PlayerState, song: SongInfo) {
    state_.futurePlaylistItems.push(song);
  },
  unshiftToHistoryPlaylist(state_: PlayerState, song: SongInfo) {
    state_.historyPlaylistItems.unshift(song);
  },
  pushToHistoryPlaylist(state_: PlayerState, song: SongInfo) {
    state_.historyPlaylistItems.push(song);
  },

  removeItemFromHistoryPlaylist(state_: PlayerState, index: number) {
    state_.historyPlaylistItems.splice(index, 1);
  },
  removeItemFromFuturePlaylist(state_: PlayerState, index: number) {
    state_.futurePlaylistItems.splice(index, 1);
  },
  replay(state_: PlayerState, index: number) {
    // const songNowPlaying = state_.songInfo;
    const songToPlay = state_.historyPlaylistItems.splice(index, 1)[0];
    state_.songInfo = songToPlay;
  },
  playInAdvance(state_: PlayerState, index: number) {
    const songToPlay = state_.futurePlaylistItems.splice(index, 1)[0];
    state_.songInfo = songToPlay;
  },
  switch2Pre(state_: PlayerState) {
    const songNowPlaying = state_.songInfo;
    const songToPlay = state_.historyPlaylistItems.splice(0, 1)[0];
    state_.songInfo = songToPlay;
    state_.futurePlaylistItems.unshift(songNowPlaying);
  },
  switch2Next(state_: PlayerState) {
    // 播放器会自动把当前播放歌曲列入历史记录中
    // const songNowPlaying = state_.songInfo;
    const songToPlay = (state_.futurePlaylistItems as any[]).splice(0, 1)[0];
    state_.songInfo = songToPlay;
    // (state_.historyPlaylistItems as any[]).unshift(songNowPlaying);
  },
};

const getters = {
  songInfo: (state_: PlayerState) => {
    return {
      avatarSrc: state_.songInfo.avatarSrc, // ?  : state_.avatarSrc,
      fileSrc: state_.songInfo.fileSrc, // ?  : state_.fileSrc,
      authors:
        state_.songInfo.authors == null ? ['未知'] : state_.songInfo.authors,
      title: state_.songInfo.title == null ? '未知' : state_.songInfo.title,
      duration:
        state_.songInfo.duration == null ? '未知' : state_.songInfo.duration,
    };
  },
  historyPlaylistItems: (state_: PlayerState) => {
    return state_.historyPlaylistItems;
  },
  futurePlaylistItems: (state_: PlayerState) => {
    return state_.futurePlaylistItems;
  },
};

const actions = {
  // setNowPlayingSongDuration(context: any, duration: string) {
  //   context.commit('setNowPlayingSongDuration', duration);
  // },
  cutIn(context: any, song: any) {
    context.commit('unshiftToFuturePlaylist', song);
  },
  append(context: any, song: any) {
    context.commit('pushToFuturePlaylist', song);
  },
  replay(context: any, index: number) {
    context.commit('replay', index);
  },
  playInAdvance(context: any, index: number) {
    context.commit('playInAdvance', index);
  },
  switch2Next(context: any) {
    // const songToPlay = getters.historyPlaylistItems;
    // const songNowPlaying = getters.songInfo;
    // context.commit('removeItemFromFuturePlaylist', 0);
    // context.commit('unshiftToHistoryPlaylist', songNowPlaying);
    // context.commit('changeSong', songToPlay);
    context.commit('switch2Next');
  },
  switch2Pre(context: any) {
    // console.log(getters);
    // const songToPlay = getters.historyPlaylistItems[0];
    // const songNowPlaying = getters.songInfo;
    // context.commit('removeItemFromHistoryPlaylist', 0);
    // context.commit('unshiftToFuturePlaylist', songNowPlaying);
    // context.commit('changeSong', songToPlay);
    context.commit('switch2Pre');
  },
  add2HistoryList(context: any, song: SongInfo) {
    context.commit('unshiftToHistoryPlaylist', song);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
