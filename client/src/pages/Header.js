import React, { useEffect, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from "@material-ui/core";

import SpotifyWebApi from "spotify-web-api-node";
import { SongContext } from "../context/SongContext";

const spotifyApi = new SpotifyWebApi({
  clientId: "43c535c882c840f6ac65786fca3bda2c",
});

// Styles
const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  header__left: {
    flex: 0.5,
    minWidth: "70px",
    backgroundColor: "white",
    color: "gray",
    borderRadius: "30px",
    padding: "10px",
    display: "flex",
    alignItems: "center",

    "& input": {
      border: "none",
      width: "100%",
      outlineWidth: 0,
      height: "100%",
    },
  },

  header__right : {
    display: "flex",
    alignItems: "center",

    "& *":{
      margin: "0px 2px"
    }
  },

});

function Header({ accessToken, search, setSearch }) {
  const classes = useStyles();
  const [user, setUser] = useState({
    display_name: "",
    images: [],
  });
  const [searchResult, setSearchResult] = useContext(SongContext)

  // * This will set the accessToken to the spotify api
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);

    //Get user details with help of accessToken  
    spotifyApi.getMe().then(data => {
      // console.log(data);
      setUser(data.body)
    })
  }, [accessToken]);

  // console.log(searchResult);

  return (
    <div className={classes.header}>
      <div className={classes.header__right}>
        <Avatar src={user?.images[0]?.url} alt={user?.display_name} />
        
        <h4>{user?.display_name}</h4>
      </div>
 
    </div>
  );
}

export default Header;
