import React, { useContext, useEffect, useState } from "react";
import axios from "../axios";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import SidebarOption from "./SidebarOption";
import HomeIcon from "@material-ui/icons/Home";
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import FavoriteIcon from '@material-ui/icons/Favorite';

import SpotifyWebApi from "spotify-web-api-node";
import { PlaylistContext } from "../context/PlaylistContext";
import { LikedSongContext } from "../context/LikedSongContext";
import { SongContext } from "../context/SongContext";

const spotifyApi = new SpotifyWebApi({
  clientId: "43c535c882c840f6ac65786fca3bda2c",
});

const useStyles = makeStyles({
  sidebar: {
    height: "100vh",
    flex: 0.1,
    backgroundColor: "black",
    color: "white",
    minWidth: "150px",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  sidebar__logo: {
    height: "70px",
    padding: "10px",
    marginRight: "flex",
  },

  sidebar__title: {
    marginLeft: "10px",
    padding: "5px",
    fontSize: "12px",
  },

  options: {
    "& p": {
      margin: "10px 0 0 20px",
      fontSize: "14px",
    },
    "& p:hover": {
      color: "white",
      cursor: "pointer",
    },
  },

  buttons: {
    margin: "10px 0 0 75px",
    fontSize: "14px",
    alignItems: "center",
  },
});



const Sidebar = ({ accessToken }) => {
  const classes = useStyles();
  const [offsetValue, setOffsetValue] = useState(0);
  const [playlist, setPlaylist] = useContext(PlaylistContext);
  const [likedSong, setLikedSong] = useContext(LikedSongContext);
  const [searchResult, setSearchResult] = useContext(SongContext)
  const [cId, setCId] = useState("");
  const [items, setItems] = useState([])

  useEffect(() => {
    axios
    .get('/userdata').then(resp => {
      var userItems = resp.data.map(userdata => (userdata.user_info.display_name))
      setItems(userItems)
      console.log(userItems)
      
  })
  },[])


  const handlePlaylist = (categoryId) => {
    if (!accessToken) return;
    if (!categoryId)  return;
    console.log(categoryId[0])
    spotifyApi.setAccessToken(accessToken);
        //   console.log(data.body);
        //* We setting CId, so that we can hold the categoryId when we toggle the button(+ & -)
        setCId(categoryId[0]);
          axios.get('/userdata')
          .then(
            resp => {
              let userObj = {}
              userObj['term'] = [categoryId[1]]
              userObj['data'] = (resp.data.find(
              userdata => userdata.user_info.display_name === categoryId[0]))
              console.log(userObj)
            setPlaylist(userObj)
          })
          setLikedSong(null)
          setSearchResult([])

  };


  const handleHomePage = () => {
    setLikedSong(null)
    
    setPlaylist(null)
    setCId("")
  }

  // Change playlist whenever offsetValue changes
  useEffect(() => {
    handlePlaylist(cId);
  }, [offsetValue]);

  return (
    <div className={classes.sidebar}>
      <img
        className={classes.sidebar__logo}
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt="Spotify-Logo"
      />

      <SidebarOption id="Home" Icon={HomeIcon} title="Home" handleHomePage={handleHomePage} />



      <br />
      <strong className={classes.sidebar__title}>Users</strong>
      <hr />

      <div className={classes.options}>
        {items.map((item) => (
          <SidebarOption
            key={item}
            id={item}
            title={item}
            handlePlaylist={handlePlaylist}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
