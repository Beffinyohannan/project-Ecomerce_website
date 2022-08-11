require("dotenv").config();
const express = require('express');
const app = express();

const bodyPaser = require('body-parser');
const session = require('express-session');
const createError = require('http-errors');
const bodyParser = require("body-parser");
var hbs = require('express-handlebars');
var db = require('./config/connection');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "hbs");
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials' }))

// session creating
const maxAge = 24 * 60 * 60 * 1000
app.use(
    session({
        secret: "key",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: maxAge }
    })
)

// mongodb connection
db.connect((err) => {
    if (err) console.log('connection error' + err)
    else console.log("database connected")
})


var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin')



app.use("/", userRouter);
app.use("/admin", adminRouter)

module.exports = app;
const port = process.env.PORT || 5500
app.listen(port, () => console.log(`server is running at port ${port}`))