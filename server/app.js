"use strict";

const express = require("express");
require('dotenv').config();

const { initDB } = require("./model/db");
const authRouter = require('./routes/authRoutes')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", authRouter);

const _port = 5000;

initDB((err) => {
    if (err) throw err;
    
    app.listen(_port, (errSrv) => {
        if (errSrv) throw errSrv;
        console.log(`Server running on port ${_port}`);
    });
});