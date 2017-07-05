require('dotenv').config()

const express = require('express'),
	  bodyParser = require('body-parser'),
	  cookieParser = require('cookie-parser'),
	  mustacheExpress = require('mustache-express'),
	  session = require('express-session'),
	  // userController = require('./controllers/users'),
	  app = express(),
	  moments = require('moment'),
	  PORT = process.env.PORT || 3000;

// const authController = require('./controllers/auth');
// const pagesController = require('./controllers/pages');
const routes = require('./controllers/routes.js');
 
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

// app.use((req, res, next) => {
// 	console.log('testing', req.body);
// 	console.log(req.originalUrl);
// 	next();
// });

const passport = require('passport');
const auth = require('./services/auth.js');
app.use(auth.passportInstance);
app.use(auth.passportSession);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', routes);

app.listen(PORT, () => console.log(`matrix online @ ${PORT}`));




