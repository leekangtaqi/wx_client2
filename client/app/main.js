import { promisify, promisifyAll } from '../framework/promisify';
import {} from '../framework/es6-polyfill';
import {} from '../framework/jQueryLean';
import riot from 'riot';
import Cookies from '../framework/cookie';
import { provide } from '../framework/riot-redux';
import router from '../framework/lean-router';
import bootstrap from './bootstrap';
import Application from './Application';
import config from './app.config';

if(process.env.NODE_ENV === 'development'){
    require('./main.scss');
}

/**
 * configure application.
 */
var app = Application(window);

app.config = config;

app.set('env', process.env.NODE_ENV ? process.env.NODE_ENV : 'development');

app.set('mode', 'browser');

app.set('context', { store: app.store, hub: router.hub, tags: {}, util: {promisify, promisifyAll}});

require('riot-form-mixin');
app.mixin('form', form);

app.router(router);

/**
 * application ready callback.
 */
app.start(async () => {
    /**
     * export app to global.
     */
    window.app = app;

    let origin = location.host.replace(location.host.split('.')[0], '').slice(1);
    await bootstrap(app, {origin});

    /**
     * router interceptors.
     */
    app.hub.on('history-pending', (from, to, $location, ctx, next) => {
        if(ctx.req.body.authenticate && !Cookies.get('token')) {
            let query = ctx.req.query;
            let fxer = Cookies.get('fxer');
            if(fxer && !query.hasOwnProperty('fxer')){
                query['fxer'] = fxer;
            }
            if($location === '/wepay'){
                $location = '/wepay/';
            }
            let referer = Object.keys(query).length ? `${$location}?${$.util.querystring.stringify(query)}` : `${$location}`;
            Cookies.set('referer', referer);
            return $.get(`/wechat/client?referer=${referer}`).then(link => {
                if(window){
                    window.location.href = link.link;
                }
                else{
                    // server side rendering.
                    return res.redirect(link.link);
                }
            });
        }
        next && next();
    });

    app.hub.on('history-resolve', (from, to, ctx, hints) => {
        if(Cookies.get('fxer') && hints.length >= 1){
            router.hub.search('fxer', Cookies.get('fxer'));
        }
        setTimeout(function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }, 0);
    })

    /**
     * import all required tags. 
     */
    require('./app.html');
    require('./commons/on-scroll.html')
    require('./commons/modal.html');
    require('./commons/alert.html');
    require('./commons/rlink.html');
    require('./commons/img-lazy-loader.html');
    require('./commons/icobar.html');
    require('./commons/bottom.html');
    require('./commons/raw.html');
    require('./commons/carousel.html');
    require('./commons/progressbar.html');
    require('./commons/radio-group.html');
    require('./commons/radio.html');

    require('./commodity/commodity-list.html');
    require('./commodity/commodity-info.html');
    require('./commodity/commodity-info-group.html'); 
    require('./group/group.html');
    require('./order/order.html');
    require('./wechat/wepay.html');
    require('./help/help.html');
    require('./partaker/partaker.html');
    require('./user/user.html');
    require('./fx/fx.html');
    require('./group/group-sku-modal.html');
    require('./group/group-poi-modal.html');
    require('./group/group-modal-post.html');

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
    
    window.widgets.Alert = app.context.tags['alert'];
    window.widgets.Modal = app.context.tags['modal'];
    /**
     * set entry for the application.
     */
    app.set('entry', riot.mount('app', {store: app.store})[0]);

    /**
     * set provider for redux.
     */
    provide(app.store)(app.entry);
});
