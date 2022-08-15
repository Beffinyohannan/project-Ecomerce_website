require("dotenv").config();
const express = require('express');
const app = express();

const bodyPaser = require('body-parser');
const session = require('express-session');
const createError = require('http-errors');
const bodyParser = require("body-parser");
const hbs = require('express-handlebars');
const db = require('./config/connection');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "hbs");

/* --------------------- connecting layout and partials --------------------- */
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials' }))


/* ---------------------------- session creating ---------------------------- */
const maxAge = 24 * 60 * 60 * 1000
app.use(
    session({
        secret: process.env.sessionKey,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: maxAge }
    })
)


/* --------------------------- mongodb connecting --------------------------- */
db.connect((err) => {
    if (err) console.log('connection error' + err)
    else console.log("database connected")
})

/* ---------------------------- routes connecting --------------------------- */
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin')

app.use("/", userRouter);
app.use("/admin", adminRouter)

/* ----------------------------- port connecting ----------------------------- */
const port = process.env.PORT || 5500
app.listen(port, () => console.log(`server is running at port ${port}`))

module.exports = app;

