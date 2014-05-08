var gzippo = require('gzippo');
var express = require('express');
var morgan  = require('morgan');
var modRewrite = require('connect-modrewrite');
var app = express();

app.use(morgan('dev'));
app.use(modRewrite(['!(\\..+)$ / [L]']));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);