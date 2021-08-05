import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { PlayTrackContext } from "../context/PlayTrackContext";
import { PlaylistContext } from "../context/PlaylistContext";

const useStyles = makeStyles({
    songRow : {
        marginLeft: "10px",
        padding: "5px",
        display: "flex",
        alignItems: "center",
        color: "white",
        marginBottom: "15px",

        '&:hover' : {
            cursor: "pointer",
            backgroundColor: "black",
            opacity: 0.8,
        }
    },

    songRow__info : {
        marginLeft : "10px",

        '& h1': {
            fontSize : "16px",
        },

        '& p': {
            fontSize: "14px",
            marginTop: "3px",
            color: "AliceBlue",
        },
    },

    songRow__album : {
        height: "45px",
        width: "45px",
    },
    

});

const TrackSearchResult = ({ track, setSearch }) => {
  const classes = useStyles()  
  const [playingTrack, setPlayingTrack] = useContext(PlayTrackContext)
  const [playlist, setPlaylist] = useContext(PlaylistContext)

  function handleClick() {
    setPlayingTrack(track)
  }
  return (
    <div className={classes.songRow} onClick={handleClick}>
      <img className={classes.songRow__album} src={track.albumUrl} alt="" />
      <div className={classes.songRow__info}>
        <h1>{track.title}</h1>
        <p>
          {track.artist}
        </p>
      </div>
    </div>
  );
};

export default TrackSearchResult;
