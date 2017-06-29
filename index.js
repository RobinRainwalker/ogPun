const express = require('express'),
	  bodyParser = require('body-parser'),
	  cookieParser = require('cookie-parser'),
	  mustacheExpress = require('mustache-express'),
	  session = require('express-session'),
	  // userController = require('./controllers/users'),
	  app = express(),
	  port = process.env.PORT || 8080;

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

const passport = require('passport');
const auth = require('./services/auth.js');
app.use(auth.passportInstance);
app.use(auth.passportSession);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', require('./controllers/users'));


app.listen(port, () => console.log(`matrix online @ ${port}`))

app.get('/', (req, res) => {
	console.log('Going to landing page')
	res.render('./landing');
});
