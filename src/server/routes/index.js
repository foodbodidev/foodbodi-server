var createError = require('http-errors');
const pathApi = '/api';

app.use('/', require('./service'));
app.use('/users', require('./users'));
app.use(pathApi, require('./api'));
app.use(pathApi + '/restaurant', require('./restaurant'));
app.use(pathApi + '/food', require('./restaurant'));

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