
const express = require('express');
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(helmet());

app.use(xss());

app.use(hpp());

app.use(cors({
  origin: [
    "https://new-cccc.vercel.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://bayg.vercel.app",
    "https://www.bayges.co.in",
    "https://bayges.co.in"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));



const routes = require("./routes/Routes");
app.use("/bayg", routes);

const database = require('./config/database');
database();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Project successfully running on ${PORT}`)
});

