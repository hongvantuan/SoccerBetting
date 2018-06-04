const routes = require('next-routes')();
routes.add('/matches/new', '/matches/new');
routes.add('/matches/:address', '/matches/show');
routes.add('/matches/:address/inputMatchResult', '/matches/inputMatchResult');
module.exports = routes;
