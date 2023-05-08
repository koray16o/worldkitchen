// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// ℹ️ Connects to the database
require('./db');

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/world-kitchen';

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

// Added helpers because I want to use
// the #eq helper
const helpers = require('handlebars-helpers');
hbs.registerHelper(helpers());

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

const session = require('express-session');
const mongoStore = require('connect-mongo');
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: true, //front end and backend are running on localhost 3000 so it is true
      httpOnly: true, //we are not using https
      maxAge: 3600000 //Session time in miliseconds (here is 1 min)
    },
    rolling: true,
    store: new mongoStore({
      mongoUrl: MONGO_URI,
      ttl: 60 * 60 * 24 //We will store the users data (cookie) 1 day in the database
    })
  })
);
//Custom middleware to get the current logged user
function getCurrentLoggedUser(req, res, next) {
  if (req.session && req.session.currentUser) {
    app.locals.currentUser = req.session.currentUser;
  } else {
    app.locals.currentUser = '';
  }
  next();
}

//Use the middleware
app.use(getCurrentLoggedUser);

// default value for title local
const capitalize = require('./utils/capitalize');
const projectName = 'worldkitchen';

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`; //If you change the name here, it will also change on thw web

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);

const recipeRoutes = require('./routes/recipe.routes');
app.use('/', recipeRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const regionsRoutes = require('./routes/regions.routes');
app.use('/', regionsRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
