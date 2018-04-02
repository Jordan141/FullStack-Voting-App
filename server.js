const express         = require('express'),
    bodyParser        = require('body-parser'),
    methodOverride    = require('method-override'),
    mongoose          = require('mongoose'),
    ejs               = require('ejs'),
    cookieParser      = require("cookie-parser"),
    passport          = require('passport'),
    LocalStrategy     = require('passport-local'),
    app               = express(),
    flash             = require('connect-flash'),
    PORT              = process.env.PORT || 8080,
    User              = require('./models/user'),
    {databaseURL}     = require('./config.json')


const pollRoutes = require('./routes/polls')
const userRoutes = require('./routes/user')


mongoose.connect(databaseURL)
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    //Change this key for your project
    secret:'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(cookieParser('secret'))
app.use(flash())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Set local variables
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
    }
)


app.use('/', pollRoutes)
app.use('/api/', userRoutes)

app.listen(PORT)