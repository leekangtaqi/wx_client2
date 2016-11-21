/**
 * Main application file
 */

'use strict';

// Set default node environment to development

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _environment = require('./config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Setup server
var app = (0, _express2.default)();
app.set('env', process.env.NODE_ENV);
var server = (0, _http.createServer)(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(_environment2.default.port, _environment2.default.ip, function () {
  console.log('91拼团微信客户端以 %s 模式, 监听 %d 端口', _environment2.default.env, _environment2.default.port);
});

// start a webpack-dev-server with config
if (process.env.NODE_ENV === 'development') {
  (function () {
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');
    var webpackConfig = require('../webpack.config.js');
    var port = webpackConfig.devServer.port;
    var host = webpackConfig.devServer.host;

    new WebpackDevServer(webpack(webpackConfig), {
      publicPath: webpackConfig.output.publicPath,
      hot: webpackConfig.devServer.hot,
      historyApiFallback: true,
      proxy: {
        "/*": 'http://localhost:' + _environment2.default.port,
        "/api/*": 'http://localhost:' + _environment2.default.port,
        "/config/*": 'http://localhost:' + _environment2.default.port
      },
      quiet: true,
      noInfo: webpackConfig.devServer.noInfo,
      stats: webpackConfig.devServer.stats
    }).listen(port, host, function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log('[system] Webpack Dev Server is startup, Listening at ' + host + ':' + port);
    });
  })();
}

// Expose app
exports = module.exports = app;