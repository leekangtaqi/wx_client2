'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _index = require('../../client/framework/lean-router/index');

var _index2 = _interopRequireDefault(_index);

var _riot = require('riot');

var _riot2 = _interopRequireDefault(_riot);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _ssrMain = require('../ssr-main');

var _ssrMain2 = _interopRequireDefault(_ssrMain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (req, res, next) {

	var origin = req.hostname.replace(req.hostname.split('.')[0], '').slice(1);
	var app = (0, _ssrMain2.default)({ req: req, res: res, origin: origin });

	// * after matches, serval components returned.
	// * require each and invoke fetch data method
	// * and set show true and update.

	// console.warn("req originalUrl 2............");
	// console.warn(router.hub.matches({location: req.originalUrl}));
	// let appTag = require('../../client/app/app.tag');
	// console.warn(appTag);
	// let html = riot.render(appTag, {store: app.store});
	// console.warn(html);
	next();
};