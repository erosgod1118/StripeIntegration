"use strict"

const express = require("express")
const session = require("express-session")
const cors = require("cors")
require('dotenv').config()

const { initDB } = require("./model/db")

const authRouter = require('./routes/authRoutes')
const stripeRouter = require('./routes/stripeRoutes')

const app = express()

app.use(session({
  secret: process.env.SESSION_SECRET_KEY, // Replace with a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/user", authRouter)
app.use("/stripe", stripeRouter)

const _port = 5000

initDB((err) => {
    if (err) throw err

    app.listen(_port, (errSrv) => {
        if (errSrv) throw errSrv
        console.log(`Server running on port ${_port}`)
    })
})