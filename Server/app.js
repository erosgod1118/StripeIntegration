"use strict";

const express = require("express");
require('dotenv').config();

const { initDB } = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./route"));

const _port = 3000;

initDB((err) => {
    if (err) throw err;
    app.listen(_port, (errSrv) => {
        if (errSrv) throw errSrv;
        console.log(`Server running on port ${_port}`);
    });
});