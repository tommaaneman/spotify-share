require('dotenv').config()
const express = require('express')
const cors = require('cors')
const spotifyWebApi = require('spotify-web-api-node')
const dataModel = require('./createData')
const createPlaylist = require('./createPlaylist')
var MongoClient = require('mongodb').MongoClient


const app = express();
app.use(cors())
app.use(express.json())

app.post("/refresh", (req,res) => {
    const refreshToken = req.body.refreshToken
    console.log('refreshed')
    const spotifyApi = new spotifyWebApi({
        redirectUri:process.env.REDIRECT_URI,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken
    })
    spotifyApi.refreshAccessToken().then(
        data => {
            res.json({accessToken: data.body.access_token,
                expiresIn: data.body.expires_in})
        }
    ).catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.post('/createplaylist', (req, res) => {
    const accessToken = req.body.accessToken
    const playlistName = req.body.playlistName
    const uris = req.body.uris
    createPlaylist(accessToken, playlistName, uris)
})

app.post('/login', (req, res) => {
    const code = req.body.code
    console.log(process.env.REDIRECT_URI)
    const spotifyApi = new spotifyWebApi({
        redirectUri:process.env.REDIRECT_URI,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
        //generate user document and upload to Mongo
        dataModel(data.body.access_token)

    }).catch((err) => {console.log('Error: ', err)})
})

app.get('/userdata', (req, res) => {
    MongoClient.connect(process.env.MONGODB_TEST_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.MONGODB_DB);
        dbo.collection(process.env.MONGODB_COLLECTION).find({}).toArray(function(err, result) {
            res.send(result)
            db.close()
        })
    })
})

app.listen(3001, '0.0.0.0')