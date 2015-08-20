var express = require('express'); // Express web server framework
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var gameApiRouter = require('./routers/api');
var authRouter = require('./routers/auth');

var app = express();

app.use(cookieParser());
app.use(expressSession({
  secret:'somesecrettokenhere',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('app'));

app.get('/route', function(req, res) {
 res.send('route');
});

app.use('/auth', authRouter);
app.use('/gameapi', gameApiRouter);

console.log('Listening on 8888');
app.listen(8888);