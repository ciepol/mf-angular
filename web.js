var gzippo = require('gzippo');
var express = require('express');
var morgan  = require('morgan');
var modRewrite = require('connect-modrewrite');
var app = express();

app.use(morgan('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.use(modRewrite(['!(\\..+)$ / [L]']));
app.use(connect.static(options.base));
app.listen(process.env.PORT || 5000);