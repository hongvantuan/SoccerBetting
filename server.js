const {createServer} = require('http');
const next = require('next');
const compression = require('compression')
const express = require('express');

const app = next({
  dev: process.env.NODE_ENV !== 'production'
});
app.prepare()
.then(() => {
  const server = express()
  server.use(compression())
});
  var setCustomHeaderFunc = function(req, res, next) {
    res.set('SpecialCustomHeader', 'super-awesome-value')
    next()
};
app.prepare()
.then(() => {
  const server = express()
  server.use('*', setCustomHeaderFunc)
});
const port = 8080;
const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() =>{
  createServer(handler).listen(port, err =>{
    if(err) throw err;
    console.log(`Ready on localhost:${port} env ${process.env.NODE_ENV}`);
  });
});
