require('dotenv').config()
const spotifyWebApi = require('spotify-web-api-node')

const createPlaylist = (accessToken, playlistName, uris) => {
    const spotifyApi = new spotifyWebApi({
        redirectUri:process.env.REDIRECT_URI,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
    })

    spotifyApi.setAccessToken(accessToken)
    spotifyApi.getUserPlaylists()
    .then(res => {
        const playlists = res.body.items
        if(playlists.map(playlist => playlist.name).includes(playlistName)) {
            const playlistId = playlists.find(playlist => playlist.name === playlistName).id
            const playlistSnapshotId = playlists.find(playlist => playlist.name === playlistName).snapshot_id
            const deleteArray = Array.from(Array(playlists.find(playlist => playlist.name === playlistName).tracks.total).keys())

            spotifyApi.removeTracksFromPlaylistByPosition(playlistId, deleteArray, playlistSnapshotId)
            .then(
                spotifyApi.addTracksToPlaylist(playlistId, uris)
                .then(res => console.log(res))
            )
        }else{
            spotifyApi.createPlaylist(playlistName)
            .then(res => {
                playlistId = res.body.id
                spotifyApi.addTracksToPlaylist(playlistId, uris)
                .then(res => console.log(res))
            })
        }
    })

}

module.exports = createPlaylist