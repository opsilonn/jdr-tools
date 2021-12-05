const state = () => ({
  playlists: [],
  savedPlaylist: { id: -1, name: "", rootFolder: { folders: [], files: [] } },

  currentPath: "",
  currentIndex: -1,
});

const getters = {
  /** */
  getPlaylistById: (state) => (id) => state.playlists.find((_) => _.id === id),
};

const mutations = {
  resetPlaylistHelper(state) {
    state.currentPath = "";
    state.currentIndex = -1;
  },

  setPlaylistHelper(state, { path, index }) {
    state.currentPath = path;
    state.currentIndex = index;
  },

  incrementPlaylistHelper(state) {
    state.currentIndex++;
  },

  /**
   *
   * @param {*} state
   * @param {*} playlist
   */
  addPlaylist(state, playlist) {
    const index = state.playlists.findIndex((_) => _.id === playlist.id);
    if (index < 0) {
      state.playlists.push(playlist);
    } else {
      state.playlists[index] = playlist;
    }
  },

  /**
   *
   * @param {*} state
   * @param {*} id
   */
  deletePlaylist(state, id) {
    const index = state.playlists.findIndex((_) => _.id === id);
    if (index >= 0) {
      state.playlists.splice(index, 1);
    }
  },

  setSavedPlaylist(state, savedPlaylist) {
    state.savedPlaylist = savedPlaylist;
  },
};

const actions = {
  /** */
  async fetchAllPlaylists({ commit }) {
    const playlists = await this.$axios.$get("/api/playlists");
    playlists.forEach((t) => commit("addPlaylist", t));
  },

  /** */
  async createPlaylist({ commit }, { name }) {
    const playlist = await this.$axios.$post("/api/playlist", {
      name: name,
    });
    commit("addPlaylist", playlist);
    return playlist;
  },

  /** */
  async updatePlaylist({ commit }, { id, name, rootFolder, total }) {
    const playlist = await this.$axios.$put(`/api/playlist/${id}`, {
      id: id,
      name: name,
      rootFolder: rootFolder || undefined,
      total: total || undefined,
    });
    commit("addPlaylist", playlist);
    return playlist;
  },

  /** */
  async deletePlaylist({ commit }, { id }) {
    const result = await this.$axios.$delete(`/api/playlist/${id}`);
    commit("deletePlaylist", id);
    return result;
  },

  // SAVED

  /** */
  async fetchSavedPlaylist({ commit }, { id }) {
    const savedPlaylist = await this.$axios.$get(`/api/playlist/${id}/saved`);
    commit("setSavedPlaylist", savedPlaylist);
  },

  /** */
  async addAudioToPlaylist(
    { commit },
    { idPlaylist, audio = { name, path }, path, index }
  ) {
    const url = `/api/playlist/${idPlaylist}/audio`;
    const params = {
      audio: {
        name: audio.name,
        path: audio.path,
      },
      path: path,
      index: index,
    };
    this.$axios
      .$post(url, params)
      .then((playlist) => commit("setSavedPlaylist", playlist));
  },

  /** */
  async updatePlaylistAudio(
    { commit },
    { idPlaylist, audio = { id, name, surname }, path }
  ) {
    const url = `/api/playlist/${idPlaylist}/audio/${audio.id}`;
    const params = {
      id: audio.id,
      name: audio.name,
      surname: audio.surname,
      audio: {
        id: audio.id,
        name: audio.name,
        surname: audio.surname,
      },
      path: path,
    };
    const playlist = await this.$axios.$put(url, params);
    commit("addPlaylist", playlist);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
