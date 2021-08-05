import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    login: {
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
        backgroundColor: 'black',

        '& img':{
            width: '50%'
        },

        '& a':{
            padding: '20px',
            borderRadius: '99px',
            backgroundColor: '#1db954',
            fontWeight: 600,
            color: 'white',
            textDecoration: 'none',
        },

        '& a:hover':{
            backgroundColor:' white',
            borderColor: '#1db954',
            color: '#1db954',
        }
    },
});

// https://developer.spotify.com/documentation/general/guides/authorization-guide/

const redirectUriTest = "http://localhost:3000/"
const redirectUriLocalNetwork = "http://192.168.1.199:3000/"
const redirectUriProd = ""
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=43c535c882c840f6ac65786fca3bda2c&response_type=code&redirect_uri=${redirectUriTest}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-top-read%20playlist-read-private%20playlist-modify-public%20playlist-modify-private`

function Login() {
    const classes = useStyles()

    return (
        <div className={classes.login}>
            <img src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg" alt="Spotify-Logo"/>
            <a href={AUTH_URL}>LOGIN WITH SPOTIFY</a>
        </div>
    )
}

export default Login
