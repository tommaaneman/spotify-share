import '../index.css';
import axios from "../axios";
import { Avatar } from "@material-ui/core";
import { ReactComponent as BellIcon } from './icons/bell.svg';
import { ReactComponent as MessengerIcon } from './icons/messenger.svg';
import { ReactComponent as CaretIcon } from './icons/caret.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as CogIcon } from './icons/cog.svg';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';
import { ReactComponent as BoltIcon } from './icons/bolt.svg';
import SpotifyWebApi from "spotify-web-api-node";
import Select from '@material-ui/core/Select';
import SidebarOption from "./SidebarOption";


import { PlaylistContext } from "../context/PlaylistContext";
import { LikedSongContext } from "../context/LikedSongContext";
import { SongContext } from "../context/SongContext";

import React, {useContext, useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

const spotifyApi = new SpotifyWebApi({
    clientId: "43c535c882c840f6ac65786fca3bda2c",
  });

function TestHeader({accessToken, testItems}) {
  return (
    <Navbar>
      <NavItem icon={<CaretIcon />}>
        <DropdownMenu testItems={testItems} token={accessToken}></DropdownMenu>
      </NavItem>
    </Navbar>
  );
}

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

function DropdownMenu(props) {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const [searchResult, setSearchResult] = useContext(SongContext)
    const [cId, setCId] = useState("");
    const [images, setImages] = useState([])
    const [playlist, setPlaylist] = useContext(PlaylistContext);
    const dropdownRef = useRef(null);

    const items = props.testItems
    const token = props.token

    // console.log(token)

    useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, [])


  const handlePlaylist = (categoryId) => {
    if (!token) return;
    if (!categoryId)  return;
    console.log(categoryId)
    spotifyApi.setAccessToken(token);
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
          setSearchResult([])

  };
    
  const handleClick = (e) => {
    const testString = e.target.getAttribute("value")
    if (testString === null) return
    const testArray = testString.split(',')
    console.log(testArray);
    handlePlaylist(testArray)
  };

  const handleHomePage = () => {
    
    setPlaylist(null)
    setCId("")
  }

  //existing fucntionality
 
  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
      
    return (
      <a value={props.value} href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
    
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem leftIcon={<CaretIcon />}><h2>Users</h2></DropdownItem>
          {items.map((item) => (
          <DropdownItem
            key={item.name}
            id={item.name}
            goToMenu={item.name}
            title={item.name}
            handlePlaylist={handlePlaylist}
            leftIcon={<Avatar src={item.image} />}
          >{item.name}</DropdownItem>
        ))}

        </div>
      </CSSTransition>

    {items.map((item) => (
        <CSSTransition
            in={activeMenu === item.name}
            timeout={500}
            onClick={handleClick}
            classNames="menu-secondary"
            unmountOnExit                
            onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
                       <h2>Back to Users</h2>
                    </DropdownItem>           
                    <DropdownItem leftIcon={<BoltIcon />} value={[item.name,"short_term_tracks"]}>Past Month Favorites</DropdownItem>
                    <DropdownItem leftIcon={<MessengerIcon />} value={[item.name,"medium_term_tracks"]}>Past Six Months Favorites</DropdownItem>
                    <DropdownItem leftIcon={<Avatar src={item.image} />} value={[item.name,"long_term_tracks"]}>All Time Favorites</DropdownItem>
                </div>
        </CSSTransition> 
    ))}

    </div>
  );
}


export default TestHeader;