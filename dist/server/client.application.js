'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _riot = require('riot');

var _riot2 = _interopRequireDefault(_riot);

var _store = require('../client/configuration/store');

var _riotRouterRedux = require('../client/framework/riot-router-redux');

var _riotRouterRedux2 = _interopRequireDefault(_riotRouterRedux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = function () {
	function Application(root) {
		_classCallCheck(this, Application);

		this.framework = _riot2.default;
		this.buildInProps = ['env', 'entry', 'context', 'mode'];
		this._mode = 'hash';
		this._store = (0, _store.configureStore)({}, this._mode);
		this.root = root;
		this._context = {
			store: this._store,
			hub: {},
			tags: {}
		};
		!root.widgets && (root.widgets = {});
		root.widgets = this._widgets = {};
	}

	Application.prototype.set = function set(prop, val) {
		this['_' + prop] = val;
		switch (this.accseptSet(prop)) {
			case 'mode':
				this._store = (0, _store.configureStore)({}, this._mode);
				if (this._router) {
					_riotRouterRedux2.default.syncHistoryWithStore(this._router.hub, this._store);
					this.mixin('router', this._router.router(this._mode));
				}
			case 'context':
				this.root.context = this._context;
				break;
		}
	};

	Application.prototype.accseptSet = function accseptSet(val) {
		if (this.buildInProps.indexOf(val) >= 0) {
			return val;
		}
		return null;
	};

	Application.prototype.router = function router(_router) {
		this._router = _router;
		_riotRouterRedux2.default.syncHistoryWithStore(this._router.hub, this._store);
		this.mixin('router', _router.router(this.mode));
		return this;
	};

	Application.prototype.registerWidget = function registerWidget(_ref) {
		var _this = this;

		var name = _ref.name;
		var methods = _ref.methods;

		var component = _riot2.default.render.tag(name);
		this._context.tags[name] = component;
		var upperName = name.replace(/(\w)/, function (v) {
			return v.toUpperCase();
		});
		this._widgets[upperName] = {};
		methods.forEach(function (method) {
			_this._widgets[upperName][method] = function () {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				component[method].apply(component, args);
			};
		});
	};

	Application.prototype.start = function () {
		var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(bootstrap) {
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return bootstrap();

						case 2:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, this);
		}));

		function start(_x) {
			return ref.apply(this, arguments);
		}

		return start;
	}();

	// if(!this.entry){
	// 	throw new Error(`application expected a entry component`);
	// }
	// this._router.hub.startup();

	Application.prototype.mixin = function mixin() {
		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return this.framework.mixin.apply(this.framework, args);
	};

	Application.prototype.on = function on() {
		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		return this.framework.on.apply(this.framework, args);
	};

	Application.prototype.one = function one() {
		for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			args[_key4] = arguments[_key4];
		}

		return this.framework.one.apply(this.framework, args);
	};

	Application.prototype.off = function off() {
		for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			args[_key5] = arguments[_key5];
		}

		return this.framework.off.apply(this.framework, args);
	};

	Application.prototype.trigger = function trigger() {
		for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
			args[_key6] = arguments[_key6];
		}

		return this.framework.trigger.apply(this.framework, args);
	};

	_createClass(Application, [{
		key: 'hub',
		get: function get() {
			return this._router.hub;
		}
	}, {
		key: 'context',
		get: function get() {
			return this._context;
		}
	}, {
		key: 'store',
		get: function get() {
			return this._store;
		},
		set: function set(val) {
			this._store = val;
		}
	}, {
		key: 'mode',
		get: function get() {
			return this._mode;
		}
	}, {
		key: 'entry',
		get: function get() {
			return this._entry;
		}
	}, {
		key: 'env',
		get: function get() {
			return this._env;
		}
	}]);

	return Application;
}();

var appCreator = function appCreator(root) {
	return new Application(root);
};

exports.default = appCreator;