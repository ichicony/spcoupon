var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var ActivityRouter = require('./routers/ActivityRouter');
// var RuleRouter = require('./routers/ActivityRuleRouter');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// 访问静态资源
app.use(express.static(path.resolve(__dirname, '../dist')));
// 访问单页//'*'
app.get('/', function (req, res) {
    var html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
    res.send(html);
});

// app.use('/activity', ActivityRouter);
// app.use('/rule', RuleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Domain捕获异常
app.use(function(req, res, next) {
  var domain = createDomain();
  domain.on('error', function(err) {
  // alternative: next(err)
  console.log(err.stack);
  res.statusCode = 500;
  res.end(err.message + '\n');
  domain.dispose();
  });
  domain.enter();
  next();
});


app.listen(8000,function(){
    console.log("node server start on 8000")
});