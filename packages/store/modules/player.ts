/* eslint-disable no-param-reassign */
// Data

const state = {
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
  changeSong(state_: any, payload: any) {
    state_.songInfo = payload;
  },
  unshiftToFuturePlaylist(state_: any, song: any) {
    (state_.futurePlaylistItems as any[]).unshift(song);
  },
  pushToFuturePlaylist(state_: any, song: any) {
    (state_.futurePlaylistItems as any[]).push(song);
  },
  unshiftToHistoryPlaylist(state_: any, song: any) {
    (state_.historyPlaylistItems as any[]).unshift(song);
  },
  pushToHistoryPlaylist(state_: any, song: any) {
    (state_.historyPlaylistItems as any[]).push(song);
  },

  removeItemFromHistoryPlaylist(state_: any, index: number) {
    (state_.historyPlaylistItems as any[]).splice(index, 1);
  },
  removeItemFromFuturePlaylist(state_: any, index: number) {
    (state_.futurePlaylistItems as any[]).splice(index, 1);
  },
  switch2Pre(state_: any) {
    const songNowPlaying = state_.songInfo;
    const songToPlay = (state_.historyPlaylistItems as any[]).splice(0, 1)[0];
    state_.songInfo = songToPlay;
    (state_.futurePlaylistItems as any[]).unshift(songNowPlaying);
  },
  switch2Next(state_: any) {
    // 播放器会自动把当前播放歌曲列入历史记录中
    // const songNowPlaying = state_.songInfo;
    const songToPlay = (state_.futurePlaylistItems as any[]).splice(0, 1)[0];
    state_.songInfo = songToPlay;
    // (state_.historyPlaylistItems as any[]).unshift(songNowPlaying);
  },
  setNowPlayingSongDuration(state_: any, duration: string) {
    state_.songInfo.duration = duration;
  },
};

const getters = {
  songInfo: (state_: any) => {
    return {
      avatarSrc: state_.songInfo.avatarSrc, // ?  : state_.avatarSrc,
      fileSrc: state_.songInfo.fileSrc, // ?  : state_.fileSrc,
      authors:
        state_.songInfo.authors == null ? ['未知'] : state_.songInfo.authors,
      title: state_.songInfo.title == null ? '未知' : state_.songInfo.title,
      duration: state_.songInfo.title == null ? '未知' : state_.songInfo.title,
    };
  },
  historyPlaylistItems: (state_: any) => {
    return state_.historyPlaylistItems;
  },
  futurePlaylistItems: (state_: any) => {
    return state_.futurePlaylistItems;
  },
};

const actions = {
  cutIn(context: any, song: any) {
    context.commit('unshiftToFuturePlaylist', song);
  },
  append(context: any, song: any) {
    context.commit('pushToFuturePlaylist', song);
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
  setNowPlayingSongDuration(context: any, duration: string) {
    context.commit('setNowPlayingSongDuration', duration);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
