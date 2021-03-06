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
<app>
  <commodity-list></commodity-list>
  <commodity-info></commodity-info>
  <commodity-info-group></commodity-info-group>
  <group></group>
  <order></order>
  <wepay></wepay>
  <help></help>
  <user></user>
  <partaker></partaker>
  <fx></fx>
  <script>
    this.mixin('router');
    this.$routeConfig([
      {
        path: '/',
        name: 'commodity-list',
        defaultRoute: true
      },
      {
        path: '/commodity/:id',
        name: 'commodity-info'
      },
      {
        path: '/commodity/:id/group',
        name: 'commodity-info-group',
        authenticate: true
      },
      {
        path: '/commodity/list',
        name: 'commodity-list',
      },
      {
        path: '/commodity/tips',
        name: 'commodity-list',
      },
      {
        path: '/group',
        name: 'group'
      },
      {
        path: '/wepay/',
        name: 'wepay',
        authenticate: true
      },
      {
        path: '/order',
        name: 'order'
      },
      {
        path: '/help',
        name: 'help'
      },
      {
        path: '/partaker',
        name: 'partaker'
      },
      {
        path: '/user',
        name: 'user'
      },
      {
        path: '/fx',
        name: 'fx'
      }
    ])
  </script>
</app>