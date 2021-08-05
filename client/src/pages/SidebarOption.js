import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  sidebarOption: {
    display: "flex",
    alignItems: "center",
    color: "FloralWhite",
    height: "40px",
    cursor: "pointer",
    transition: "200ms color ease-in",

    "&:hover": {
      color: "white",
    },
  },
  sidebarOption__icon: {
    
    padding: "0 5px",
    color: "white",
    height: "40px",
    width: "40px",
  },

  formControl: {
    margin: theme.spacing(-2),
    top: "10px",
    bottom: "1px",
    minWidth: 135,
    color: "white",
    border: "1mm ridge rgb(91, 87, 115)",
    borderRadius: "3px",
    background: "white",
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  testlabel: {
    color: "white"
  }
  
}));

function SidebarOption({ title, Icon, id, handlePlaylist, handleLikedSongs, handleHomePage }) {
  const classes = useStyles();

  // Moved getPlaylist to Sidebar, so that we shuffle through different playlists

  const handleClick = (e) => {
    handlePlaylist(e.target.value)
    // console.log(e.target);
  };

  const handleLike = () => {
    handleLikedSongs();
  };

  const handleHome = () => {
    handleHomePage()
  };
  
  return (
    <div className={classes.sidebarOption}>
      {Icon && <Icon className={classes.sidebarOption__icon} />}
      {Icon ? (
        <h4 onClick={(id === "Like" && handleLike ) || (id="Home" && handleHome)}>{title}</h4>
      ) : (
        <p><FormControl classname="testlabel" className={classes.formControl}>
        <InputLabel  id={id}>{title}</InputLabel>
        <Select
          labelId={id}
          id={id}
          value={id}
          onClick={handleClick}
          autoWidth
        ><MenuItem value="" disabled>
        <em>{id}'s:</em>
      </MenuItem>
          <MenuItem value={[id,"short_term_tracks"]}>Past Month Favorites</MenuItem>
          <MenuItem value={[id,"medium_term_tracks"]}>Past Six Months Favorites</MenuItem>
          <MenuItem value={[id,"long_term_tracks"]}>All Time Favorites</MenuItem>
        </Select>
      </FormControl></p>
      )}
    </div>
  );
}

export default SidebarOption;
