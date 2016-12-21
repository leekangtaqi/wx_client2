import Cookies from '../framework/cookie';
import originConfig from '../../server/config/environment/shared';

const bootstrap = async (app, {origin}) => {
    let {env, store} = app;
    let config = originConfig[env];
    let dispatch = store.dispatch;
    let Wechat = require('./wechat/wechat.api').default;
    
    Object.assign($, $.ajax.base(`${config.apiUri[origin]}/api`));
    
    $.setErrorInterceptor((e, chain) => {
        let response = e.response;
        if(!response){
            console.error("[action Failed]")
            console.error(e);
            return;
        }
        if(response && response.status === 401) {
            Cookies.remove('token');
            let route = store.getState().route;
            let referer = route.$location.replace('_', '');
            referer = referer.startsWith('/') ? referer : '/' + referer;
            Cookies.set('referer', referer);
            return $.get('/wechat/client?referer=' + referer).then(link => location.href = link.link);
        }
        try{
            response.json().then(data => {
                widgets.Alert.add('danger', data.errmsg); 
            });
        }catch(e){
            widgets.Alert.add('danger', '系统错误');
        }
    })

    $.addResponseInterceptor(response => {
        if(response.status === 205) {
            Cookies.remove('token');
            location.reload();
            return;
        }
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    })
    
    let headers = {'X-API-From': config.from};

    Object.assign($, $.withProps({headers}));

    const getQuery = query => $.util.querystring.parse(window.location.search.replace('?', ''))[query];

    let fxer = getQuery('fxer');
    if(fxer){Cookies.set('fxer', fxer);}
    if(Cookies.get('fxer')) {
        headers['X-FXER'] = Cookies.get('fxer');
    }
    Object.assign($, $.withProps({headers}));

    let code = getQuery('code');
    if(code){
        let res = await fetch(`${config.apiUri[origin]}/api/wechat/token?code=${code}`, {
            method: 'get',
            headers: {
                'X-API-From': config.from,
                'X-Component': config.component
            }
        });
        let { token } = await res.json();
        if(token){
            Cookies.set('token', token);
        }
        let referer = Cookies.get('referer');
        window.location.href = `${window.location.origin}${referer}`;
        return;
    }

    let token = Cookies.get('token'); 

    if(token) {
        headers.Authorization = token;
        Object.assign($, $.withProps({headers}));
        let user = await $.get('/wechat/userinfo');
        dispatch({type: 'user', payload: user});
    }

    Wechat.config();
    Wechat.ready();

    wx.error(function(res){
      widgets.Alert.add('warn', res.errMsg);
    //   Wechat.config();
    });

    /**
     * mock login
     */
//  let resExp = await $.get('/wechat/experience');
//  let token = resExp.token;
//  Cookies.set('token', token); 
//  headers.Authorization = token;
//  Object.assign($, $.withProps({headers}));
//  let user = await $.get('/wechat/userinfo');
//  dispatch({type: 'user', payload: user});

    /**
     * load merchant info
     */

    $.get('/merchant')
        .then(data => {
            dispatch({type: 'fetchMerchant', payload: data});
            app.trigger('merchant', data);
            let title = data.pubno.nick_name + '的火爆拼团';
            let desc = '拼团购买更优惠，一起到' + data.pubno.nick_name + '来拼吧';
            Wechat.ready({title: title, desc: desc, timeline: desc});  
            dispatch({type: 'isAndriod', payload: navigator.userAgent.match(/Android/i)})
        })
}
export default bootstrap;