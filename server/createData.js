require('dotenv').config()
const spotifyWebApi = require('spotify-web-api-node')
const fs = require('fs')
const dbSend = require('./dbSend')

const deleteNonsense = (userData) => {
    const termsDelete = ['short_term', 'medium_term', 'long_term']
    termsDelete.forEach((termDelete) => {
        userData[`${termDelete}_tracks`].forEach((track) => {
        delete track["available_markets"]
        delete track.album["available_markets"]
        delete track.album["artists"]
        })    
    })
    return deleteNonsense
}

var userDataObject ={}
var userDataModel = {}

const dataModel = (accessToken) => {
    const spotifyApi = new spotifyWebApi({
        redirectUri:process.env.REDIRECT_URI,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
    })

    spotifyApi.setAccessToken(accessToken)
    
    //Get current user information
    spotifyApi.getMe()
    .then(userInfo => {
        userDataObject['user_info'] = userInfo.body
    
        //get current user timebased top tracks Looped
    const terms = ['short_term', 'medium_term', 'long_term']
    terms.forEach((term) => {
    spotifyApi.getMyTopTracks({
            time_range: term,
            limit: 50,
            offset: 0
    })
    .then(termTracks => {
                    //verander shit 
        userDataObject[`${term}_tracks`] = termTracks.body.items
                    userDataModel= userDataObject                
                    //expecting 4 keys: user, short, medium and long term tracks
                    if(Object.keys(userDataModel).length === 4) {
                        deleteNonsense(userDataModel)
                        dbSend(userDataModel)
                        // fs.writeFileSync('test.json', JSON.stringify(userDataModel))
                    }
                })
            })
        //END OF TERM LOOP  
    })
    .catch((err) => console.log(err))
}

module.exports = dataModel