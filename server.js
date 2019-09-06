require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedata.json')

const app = express()
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

//define middleware for validate API token
app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
   if (!authToken || authToken.split(' ')[1] !== apiToken) {
       return res.status(401).json({ error: 'Unauthorized request' })
     }
   next()
  })

//define middleware to handle different query params

app.get('/movie', (req,res)=>{
    let results = MOVIEDEX
    
    if(req.query.genre){
        results = results.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }
    if(req.query.country){
        results= results.filter(movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }
    if(req.query.avg_voting){
        let avg_voting = Number(req.query.avg_voting)
        console.log(avg_voting)
         results = results.filter(movie => 
             movie.avg_vote >= avg_voting)
           
    }

    res.json(results)
})


const PORT = '8000'
app.listen(PORT, ()=>{
    console.log(`Server listening at http://localhost:${PORT}`)
})