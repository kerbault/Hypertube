const express = require('express');
const router = express.Router();
const User = require('../model/User');

const mongoose = require('mongoose');
const database = process.env.C_MONGO;

mongoose.connect(database, {useNewUrlParser: true});

