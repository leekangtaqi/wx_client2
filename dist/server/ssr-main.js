'use strict';

var _this2 = this;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _promisify = require('../client/framework/promisify');

var _riot = require('riot');

var _riot2 = _interopRequireDefault(_riot);

var _riotRedux = require('../client/framework/riot-redux');

var _leanRouter = require('../client/framework/lean-router');

var _leanRouter2 = _interopRequireDefault(_leanRouter);

var _client = require('./client.application');

var _client2 = _interopRequireDefault(_client);

var _app = require('../client/app/app.config');

var _app2 = _interopRequireDefault(_app);

var _shared = require('./config/environment/shared');

var _shared2 = _interopRequireDefault(_shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

//todo css

/**
 * @param obj {Object}
 *  req
 *  res
 *  origin
 * @returns app
 */
module.exports = function (_ref) {
    var _this = this;

    var req = _ref.req;
    var res = _ref.res;
    var origin = _ref.origin;

    global.fetch = _nodeFetch2.default;
    require('../client/framework/jQueryLean');
    var app = (0, _client2.default)(global);
    app.config = _app2.default;

    app.set('env', process.env.NODE_ENV ? process.env.NODE_ENV : 'development');

    app.set('mode', 'browser');

    app.set('context', { store: app.store, hub: _leanRouter2.default.hub, tags: {}, util: { promisify: _promisify.promisify, promisifyAll: _promisify.promisifyAll } });

    // require('riot-form-mixin');
    // app.mixin('form', form);

    app.router(_leanRouter2.default);

    /**
     * application ready callback.
     */
    app.start(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        /**
                         * export app to global.
                         */
                        global.app = app;

                        /**
                         * router interceptors.
                         */
                        app.hub.on('history-pending', function (from, to, $location, ctx, next) {
                            if (ctx.req.body.authenticate && !req.cookies.token) {
                                var query = ctx.req.query;
                                var fxer = req.cookies.get('fxer');
                                if (fxer && !query.hasOwnProperty('fxer')) {
                                    query['fxer'] = fxer;
                                }
                                if ($location === '/wepay') {
                                    $location = '/wepay/';
                                }
                                var referer = Object.keys(query).length ? $location + '?' + $.util.querystring.stringify(query) : '' + $location;
                                res.cookie('referer', referer);
                                return $.get('/wechat/client?referer=' + referer).then(function (link) {
                                    return res.redirect(link.link);
                                });
                            }
                            next && next();
                        });

                        app.hub.on('history-resolve', function (from, to, ctx, hints) {
                            if (req.cookies.get('fxer') && hints.length === 1) {
                                _leanRouter2.default.hub.search('fxer', req.cookies.fxer);
                            }
                        });

                        /**
                         * register widgets.
                         */
                        app.registerWidget({
                            name: 'alert',
                            methods: ['add']
                        });

                        app.registerWidget({
                            name: 'modal',
                            methods: ['open']
                        });

                        global.widgets.Alert = app.context.tags['alert'];
                        global.widgets.Modal = app.context.tags['modal'];

                        _context.next = 9;
                        return bootstrap(app, { req: req, res: res, origin: origin });

                    case 9:
                        /**
                         * set entry for the application.
                               * todo ....
                         */
                        app.set('entry', _riot2.default.render.tag('app', { store: app.store }));

                        /**
                         * set provider for redux.
                         */
                        (0, _riotRedux.provide)(app.store)(app.entry);

                        //todo provider.

                    case 11:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this);
    })));
    return app;
};

/**
 * 1.do some data fetch (user, merchant)
 * 2.set rest api (base, intercept, headers)
 */
var bootstrap = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref2, _ref3) {
        var env = _ref2.env;
        var store = _ref2.store;
        var req = _ref3.req;
        var res = _ref3.res;
        var origin = _ref3.origin;

        var config, dispatch, headers, fxer, code, data, _ref4, _token, referer, token, user;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        config = _shared2.default[env];
                        dispatch = store.dispatch;

                        Object.assign($, $.ajax.base(config.apiUri[origin] + '/api'));

                        $.setErrorInterceptor(function (e, chain) {
                            var response = e.response;
                            if (!response) {
                                console.error("[action Failed]");
                                console.error(e);
                                return;
                            }
                            if (response && response.status === 401) {
                                res.clearCookie('token');
                                var route = store.getState().route;
                                var referer = route.$location.replace('_', '');
                                res.cookie('referer', referer);
                                return $.get('/wechat/client?referer=' + referer).then(function (link) {
                                    return res.redirect(link.link);
                                });
                            }
                            try {
                                response.json().then(function (data) {
                                    widgets.Alert.add('danger', data.errmsg);
                                });
                            } catch (e) {
                                widgets.Alert.add('danger', '系统错误');
                            }
                        });

                        $.addResponseInterceptor(function (response) {
                            if (response.status === 205) {
                                res.clearCookie('token');
                                res.redirect(req.get('referer'));
                                return;
                            }
                            if (response.status >= 200 && response.status < 300) {
                                return response;
                            } else {
                                var error = new Error(response.statusText);
                                error.response = response;
                                throw error;
                            }
                        });

                        headers = { 'X-API-From': config.from };


                        Object.assign($, $.withProps({ headers: headers }));

                        fxer = req.query.fxer;

                        if (fxer) {
                            res.cookie('fxer', fxer);
                        }
                        if (req.cookies.fxer) {
                            headers['X-FXER'] = req.cookies.fxer;
                        }
                        Object.assign($, $.withProps({ headers: headers }));

                        code = req.query.code;

                        if (!code) {
                            _context2.next = 24;
                            break;
                        }

                        _context2.next = 15;
                        return (0, _nodeFetch2.default)(config.uri + '/api/wechat/token?code=' + code, {
                            method: 'get',
                            headers: {
                                'X-API-From': config.from,
                                'X-Component': config.component
                            }
                        });

                    case 15:
                        data = _context2.sent;
                        _context2.next = 18;
                        return data.json();

                    case 18:
                        _ref4 = _context2.sent;
                        _token = _ref4.token;

                        if (_token) {
                            res.cookie('token', _token);
                        }
                        referer = req.cookies.referer;

                        res.redirect('' + origin + referer);
                        return _context2.abrupt('return');

                    case 24:
                        token = req.cookies.token;

                        if (!token) {
                            _context2.next = 32;
                            break;
                        }

                        headers.Authorization = token;
                        Object.assign($, $.withProps({ headers: headers }));
                        _context2.next = 30;
                        return $.get('/wechat/userinfo');

                    case 30:
                        user = _context2.sent;

                        dispatch({ type: 'user', payload: user });

                    case 32:

                        /**
                         * load merchant info
                         */
                        $.get('/merchant').then(function (data) {
                            dispatch({ type: 'fetchMerchant', payload: data });
                            dispatch({ type: 'isAndriod', payload: navigator.userAgent.match(/Android/i) });
                        });

                    case 33:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, _this2);
    }));

    return function bootstrap(_x, _x2) {
        return ref.apply(this, arguments);
    };
}();