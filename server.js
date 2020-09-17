const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex'); //to connect the database with the backend

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({ //we connect with the database using knex
    client: 'pg', //because we use postgreSQL
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
});

const app = express();

app.use(express.json()); //we have to parse the information we are getting
app.use(cors()); //so that google chrome doesn't bother us with security issues

app.get('/', (req, res) => res.send('it is working'))
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)}); //dependency injection
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});


app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});

/*
Organizing the API structure I want <- old

/ --> res = this is working
/signin --> POST = succes/fail      it's POST because we are sending a password
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/

