const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport")
const bodyParser = require('body-parser');
const fs = require('fs');

//Load routers
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/authentication');
const retrievalRouter = require('./routes/retrieval');
const paymentRouter = require('./routes/payment');
const marketplaceRouter = require('./routes/marketplace');
const qrRouter = require('./routes/qr');
const userRouter = require('./routes/user');

const debugRouter = require('./routes/debug');
const {
    passportStrategy,
    passportSerializeUser,
    passportDeserializeUser, passportSessionErrorHandler, sessionErrorHandler, sessionSetup
} = require("./auth/passportAuth");
const { isAuthenticated, authInfo, isStaff} = require("./middlewares/auth")

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
app.use(passport.authenticate('session'))
/* Session Error Handler */
app.use(sessionErrorHandler);

/* Passport setup */
passport.use(passportStrategy)
passport.serializeUser(passportSerializeUser)
passport.deserializeUser(passportDeserializeUser)


/* Google Passport Strategy */
require('./auth/googlePassportAuth')(passport)

/* Facebook Passport Strategy */
require('./auth/facebookPassportAuth')(passport)

/* Static files */
app.use("/stylesheets", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use("/javascripts", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
app.use("/javascripts", express.static(path.join(__dirname, "node_modules/jquery/dist")))

// Most routes start with / rather than /<name of file> as the files are being used as descriptive groups of routes
app.use('/', authInfo, indexRouter);
app.use('/qr', authInfo, qrRouter)
app.use('/admin', isAuthenticated, isStaff, adminRouter);
app.use('/', authRouter);
app.use('/', isAuthenticated, retrievalRouter);
app.use('/', isAuthenticated, paymentRouter);
app.use('/', isAuthenticated, marketplaceRouter);
app.use('/', isAuthenticated, userRouter);

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

    //Check if the error page exists in 'views/error' and render it, otherwise render the default error page
    //Check if file exists
    if (fs.existsSync(path.join(__dirname, 'views', 'error', `${err.status || 500}.ejs`)) === true) {
        res.render(`error/${err.status || 500}`, {auth: req.isLoggedIn, user: req.user, message: err?.message});
    } else {
        res.render('error', {auth: req.isLoggedIn, user: req.user, message: err?.message});
    }
});

module.exports = app;
