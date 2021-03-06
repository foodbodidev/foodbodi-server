var createError = require('http-errors');
const prefix = '/api';

app.use('/', require('./service'));
app.use('/users', require('./users'));
app.use(prefix, require('./api'));
app.use(prefix + '/search', require('./search'));
app.use(prefix + '/restaurant', require('./restaurant'));
app.use(prefix + '/food', require('./food'));
app.use(prefix + '/metadata', require('./metadata'));
app.use(prefix + "/upload", require("./uploader"));
app.use(prefix + "/comment", require("./comment"));
app.use(prefix + "/license", require("./license"));
app.use(prefix + "/reservation", require("./reservation"));
app.use(prefix + "/dailylog", require("./daily_log"));
app.use(prefix + "/ingredient", require("./ingredient"));
app.use(prefix + "/notification", require("./notification"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("Error : " + JSON.stringify(err));
  res.status = err.status || 500;
  res.send({
    message :  err.message || "Internal server error"
  });

});