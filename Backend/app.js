const dotenv = require('dotenv')
dotenv.config()


const express = require('express')
const app = express()
const connectDb = require('./db/db')


const cors = require('cors')

const cookieParser = require('cookie-parser') 

const businessRoutes = require('./routes/business.routes')


app.use(cors());
connectDb();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use('/business',businessRoutes);


app.get('/', (req, res) => {
  res.send('Hello Youtube!')
})


module.exports = app