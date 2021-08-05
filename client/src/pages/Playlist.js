import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TrackSearchResult from "../components/TrackSearchResult";
import { PlayTrackContext } from "../context/PlayTrackContext";
import axios from "../axios";

const useStyles = makeStyles({
  body__info: {
    display: "flex",
    alignItems: "flex-end",
    padding: "5px",

    "& img": {
      height: "100px",
      margin: "10 10px",
      boxShadow: "0 4px 60px rgba(0,0,0,0.5)",
    },
  },

  body__shufflebutton: {
    alignItems: "flex-end",
    padding: "5px",    
    height: "40px",

    "& img": {
      height: "4vw",
      margin: "0 25px",
      
    },
    '&:hover' : {
      cursor: "pointer",
      backgroundColor: "grey",
      opacity: 0.8,
  }
  },
  body__playlistbutton: {
    alignItems: "flex-end",
    padding: "5px",    
    height: "40px",

    "& img": {
      height: "4vw",
      margin: "0 25px",
      
    },
    '&:hover' : {
      cursor: "pointer",
      backgroundColor: "grey",
      opacity: 0.8,
  }
  },
  body__playbutton: {
    alignItems: "flex-end",
    padding: "5px",
    height: "40px",

    "& img": {
      height: "4vw",
      margin: "0 25px",
      
    },
    '&:hover' : {
      cursor: "pointer",
      backgroundColor: "grey",
      opacity: 0.8,
  }
  },

  body__infoText: {
    flex: "1",

    "& h2": {
      fontSize: "28px",
      marginBottom: "2px",
    },

    "& p": {
      fontSize: "8px",
    },
  },
});

const Playlist = ({accessToken, playlist, setSearch }) => {
  const classes = useStyles();
  const [playlistTrack, setPlaylistTrack] = useState([]);
  const [playingTrack, setPlayingTrack] = useContext(PlayTrackContext)
  
  const playlistData = playlist.data
  const playlistTerm = playlist.term

  if(playlistTerm[0] === "short_term_tracks") {var displayTerm = "Past Month Favorites"}
  if(playlistTerm[0] === "medium_term_tracks") {var displayTerm = "Past Six Months Favorites"}
  if(playlistTerm[0] === "long_term_tracks") {var displayTerm = "All Time Favorites"}

  useEffect(() => {
    if (!playlistTrack) return setPlaylistTrack([]);
    
    console.log(displayTerm)
    setPlaylistTrack(
      
      playlistData[playlistTerm].map((track) => {
        // This will get the smallest album img from the image array
        let smallestAlbumImage = track.album.images.reduce(
          (smallestImg, currentImg) => {
            if (currentImg.height < smallestImg) return currentImg;
            // else
            return smallestImg;
          },
          track.album.images[0]
        );
        // Returning some specific things that we require in a object form
        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url,
        };
      })
    );
  }, [playlist]);

  function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  function handleClick() {
    setPlayingTrack({"uri":playlistData[playlistTerm].map(track => track.uri)})
  }

  function handleClickRandom() {
    console.log('click random')
    setPlayingTrack({"uri":shuffle(playlistData[playlistTerm].map(track => track.uri))})
  }
  function handleClickPlaylist() {
    axios
    .post("/createplaylist", {
      accessToken,
      playlistName: `${displayTerm} of ${playlistData.user_info.display_name}`,
      uris: playlistData[playlistTerm].map(track => track.uri)
    })
    .then((response) => {
      console.log(response)
    })
    .catch((err) => {
      console.log(err)
    })

  }

  return (
    <div>
      <div className={classes.body__info}>
        <img src={playlistData?.user_info.images[0].url} alt="" />
        </div>
        <div className={classes.body__info}>
        <div className={classes.body__infoText}>
          <strong>{displayTerm} of:</strong>
          <h2>{playlistData?.user_info.display_name}</h2>
        </div>
      </div>

      <div  >
        <img className={classes.body__playbutton} onClick={handleClick} src="https://jccdallas.org/wp-content/uploads/2020/06/Spotify-Play-Button-1.png" alt="" />
        <img className={classes.body__shufflebutton} onClick={handleClickRandom} src="https://creazilla-store.fra1.digitaloceanspaces.com/emojis/56624/shuffle-tracks-button-emoji-clipart-md.png" alt="" />
        Create Playlist: <img className={classes.body__playlistbutton} onClick={handleClickPlaylist} src="https://icon-library.com/images/add-to-playlist-icon/add-to-playlist-icon-8.jpg" alt="" />
      </div>
      <hr />
      <div className={classes.all__songs}>
        {playlistTrack.map((track) => {
          return <TrackSearchResult track={track} key={track.uri} setSearch={setSearch} />;
        })}
      </div>
    </div>
  );
};

export default Playlist;
