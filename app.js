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

// app.engine('hbs',hbs.engine({
//     extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/partials/',helpers: {
//       inc: function (value, options) {
//         return parseInt(value) + 1;
//       }
//     }
//   }))



/* --------------------- connecting layout and partials --------------------- */
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials',
helpers: {
    inc: function (value, options) {
      return parseInt(value) + 1;
    }
  } }))



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

/* -------------------------------------------------------------------------- */
/*                   catch 404 and forward to error handler                   */
/* -------------------------------------------------------------------------- */

app.use(function (req, res, next) {
    next(createError(404));
  });
  
  /* -------------------------------------------------------------------------- */
  /*                                error handler                               */
  /* -------------------------------------------------------------------------- */
  
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    /* -------------------------------------------------------------------------- */
    /*                            render the error page                           */
    /* -------------------------------------------------------------------------- */
  
    res.status(err.status || 500);
    res.render('404page2');
  });

/* ----------------------------- port connecting ----------------------------- */
const port = process.env.PORT || 5500
app.listen(port, () => console.log(`server is running at port ${port}`))

module.exports = app;

