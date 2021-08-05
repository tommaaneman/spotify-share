import React,{useContext, useEffect, useState} from 'react'
import TestHeader from './TestHeader';
import axios from "../axios";
import { makeStyles } from '@material-ui/core/styles';
import TrackSearchResult from '../components/TrackSearchResult';
import { SongContext } from "../context/SongContext";
import { LyricsContext } from '../context/LyricsContext';
import { PlayTrackContext } from '../context/PlayTrackContext';
import { PlaylistContext } from '../context/PlaylistContext';
import Playlist from './Playlist';
import { LikedSongContext } from '../context/LikedSongContext';
import LikedSongs from './LikedSongs';

// Styles
const useStyles = makeStyles({
    body : {
        height: "100vh",
        flex: 1,
        color: "white",
        background: "linear-gradient(rgb(91, 87, 115), rgba(0,0,0,1))",
        padding: "30px",
        overflowY: "overlay",

        '&::-webkit-scrollbar' : {
            display : "none"
        }
    },

    all__songs : {
        margin: "20px -30px",
    },

    lyrics : {
      textAlign: "center",
      whiteSpace: "pre",
    }
})


const Body = ({accessToken}) => {
    const classes = useStyles()
    const [searchResult, setSearchResult] = useContext(SongContext)
    const [playingTrack,setPlayingTrack] = useContext(PlayTrackContext)
    const [lyrics,setLyrics] = useContext(LyricsContext)
    const [playlist, setPlaylist] = useContext(PlaylistContext)
    const [likedSong, setLikedSong] = useContext(LikedSongContext);
    const [search, setSearch] = useState("")
    const [items, setItems] = useState([])

    useEffect(() => {
      axios
      .get('/userdata').then(resp => {
        var userItems = resp.data.map(userdata => {
            var userItems = {}
            userItems['name'] = userdata.user_info.display_name
            userItems['image'] = userdata.user_info.images[0].url
            return userItems
          })
          // userItems = userItems.map(item => item.name)
          // var userImages = userItems.map(item => item.image)
          // setImages(userImages)
        setItems(userItems)      
    })
    },[])

    return (
      <div className={classes.body}>
        {<TestHeader testItems={items} accessToken={accessToken} search={search} setSearch={setSearch} />}
        <div className={classes.all__songs}>
          {searchResult.map((track) => {
            return <TrackSearchResult track={track} key={track.uri} setSearch={setSearch} />;
            // return <h1>Yoo</h1>
          })}
          {(searchResult.length === 0 && playlist === null && likedSong === null)&& (
            <div className={classes.lyrics}>{lyrics}</div>
          )}
        </div>
        
        {playlist !== null && <Playlist accessToken={accessToken} playlist={playlist} setSearch={setSearch} />}
        {likedSong !== null && <LikedSongs likedSong={likedSong} setSearch={setSearch} />}
      </div>
    );
}

export default Body
