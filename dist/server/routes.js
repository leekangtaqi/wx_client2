/**
 * Main application routes
 */

'use strict';

var _errors = require('./components/errors');

var _errors2 = _interopRequireDefault(_errors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import serverSideRendering from './middlewares/server-side-rendering';

module.exports = function (app) {

  // app.use(serverSideRendering);
  // Insert routes below
  app.use('/config', require('./api/config'));
  app.use('/qrcode', require('./api/qrcode'));
  app.use('/qrgun', require('./api/qrgun'));
  app.use('/audio', require('./api/audio'));
  app.use('/api', require('./api/api'));

  app.route('/MP_verify_:mpId.txt').get(function (req, res) {
    res.send(req.params.mpId);
  });
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(_errors2.default[404]);

  // All other routes should redirect to the index.html
  app.route('/*').get(function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, '../', app.get('appPath') + '/index.html'));
  });
};