const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport")
const session = require("express-session")
const bodyParser = require('body-parser');



const mongo = require('./model/mongodb')

//Load routers
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/authentication');
const dataRouter = require('./routes/data');
const paymentRouter = require('./routes/payment');
const marketplaceRouter = require('./routes/marketplace');
const userRouter = require('./routes/user');

const debugRouter = require('./routes/debug');
const {
    passportStrategy,
    passportSerializeUser,
    passportDeserializeUser, passportSessionErrorHandler, sessionErrorHandler, sessionSetup
} = require("./auth/passportAuth");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Session Auth Setup */
app.use(sessionSetup);

/* Session Error Handler */
app.use(sessionErrorHandler);

/* Passport setup */
passport.use(passportStrategy)
passport.serializeUser(passportSerializeUser)
passport.deserializeUser(passportDeserializeUser)

/* Static files */
app.use("/stylesheets", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use("/javascripts", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
app.use("/javascripts", express.static(path.join(__dirname, "node_modules/jquery/dist")))

// Most routes start with / rather than /<name of file> as the files are being used as descriptive groups of routes
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/', authRouter);
app.use('/', dataRouter);
app.use('/', paymentRouter);
app.use('/', marketplaceRouter);
app.use('/', userRouter);

if (process.env.ENVIRONMENT === undefined || process.env.ENVIRONMENT !== "prod") {
    app.use('/debug', debugRouter);
}



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
