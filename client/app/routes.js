/**
 * palce children to router-outlet
 */

import groupActions from './group/group.actions';
import partakerActions from './partaker/partaker.actions';

export default {
	component: 'app',
	path: '',
	children: [
		{
			path: '/',
			defaultRoute: true,
			component: 'commodity-list',
		},
		{
			path: '/commodity/:id',
			component: 'commodity-info',
		},
		{
			path: '/commodity/:id/group',
			component: 'commodity-info-group',
			authenticate: true
		},
		{
			path: '/commodity/list',
			component: 'commodity-list',
		},
		{
			path: '/commodity/tips',
			component: 'commodity-list',
		},
		{
			path: '/group',
			component: 'group',
			children: [
				{
					path: '/miss',
					component: 'group-list'
				},
				{
					path: '/list',
					component: 'group-list'
				},
				{
					path: '/:id',
					component: 'group-info',
					resolve: (next, ctx) => {
						app.store.dispatch(groupActions.loadGroupById(ctx.req.params.id, data => {
							ctx.req.body.group = data;
							next();
						}));
					}
				},
			]
		},
		{
			path: '/wepay/',
			component: 'wepay',
			authenticate: true
		},
		{
			path: '/order',
			component: 'order',
			children:[
        {
          path: '/list',
          component: 'order-list',
          authenticate: true
        },
        {
          path: '/:id',
          component: 'order-detail',
          authenticate: true,
          resolve: (next, ctx) => app.store.dispatch(partakerActions.loadPartakerById(ctx.req.params.id, next))
        },
        {
          path: '/:id/refund',
          component: 'order-refund',
          authenticate: true
        },
        {
          path: '/:id/tmplmsg',
          component: 'order-tmplmsg',
          authenticate: true
        }
      ]
		},
		{
			path: '/help',
			component: 'help',
			children: [
        {
          path: '/more',
          component: 'help-more'
        },
        {
          path: '/merchant',
          component: 'help-merchant'
        }
      ]
		},
		{
			path: '/partaker',
			component: 'partaker',
			children: [
        {
          path: '/my',
          component: 'partaker-my'
        },
        {
          path: '/list',
          component: 'partaker-list'
        }
      ]
		},
		{
			path: '/user',
			component: 'user',
			children: [
        {
          path: '/redpacket',
          component: 'user-redpacket'
        }
      ]
		},
		{
			path: '/fx',
			component: 'fx',
			children: [
        {
          path: '/info',
          component: 'fx-info'
        },
        {
          path: '/apply',
          component: 'fx-apply'
        },
        {
          path: '/result',
          component: 'fx-result'
        }
      ]
		}
	]
}