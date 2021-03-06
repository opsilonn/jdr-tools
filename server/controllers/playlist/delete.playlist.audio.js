import Playlist from "../../models/playlist.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deletePlaylistAudio(req, res) {
  try {
    const playlist = await Playlist.deleteItem(
      req.params.idPlaylist,
      req.params.idItem
    );
    res.status(200).json(playlist);
  } catch (err) {
    console.log(err);
    res.status(404).json(err.message);
  }
}
