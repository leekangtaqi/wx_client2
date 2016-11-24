const partakersNextPage = (query, done) => (dispatch, getState) => {
	var state = getState();
	if(state.partakers.busy) return;
	dispatch({type: 'partakersBusy', payload: true});
	var params = state.partakers.params;
	Object.assign(params, query, {limit: state.partakers.limit, page: state.partakers.page});

	$.get(`/partaker?${$.util.querystring.stringify(params)}`).then(data => {
		var count = data[0];
		var items = data[1];
		dispatch({type: 'partakersNextPage', payload: {count, items: items}});
		if((state.partakers.items.length + items.length) >= count){
				dispatch({type: 'partakersBusy', payload: true});
				return;
		}	
		dispatch({type: 'partakersUnBusy', payload: true});
	})
}

const resetPartakerAndNextPage = (query, done) => (dispatch, getState) => {
	dispatch({type: 'resetPartakers', payload: null});
	dispatch(partakersNextPage(query, done));
} 

const loadPartakerById = (id, done = function noop(){}) => dispatch => {
	$.get('/partaker/' + id).then(data => {
		dispatch({type: 'setPartaker', payload: data.partaker});
		dispatch({type: 'setPartakerQrcode', payload: data.qrcode});
		done();
	})
}

const findPartakerAndGroupByGroupIdAndUserId = id => async (dispatch, getState) => {
	try{
		let ptk	= await $.get('/partaker/i?group=' + id);
		if(ptk.order && ptk.order.status.pay == '1'){
			return riot.route(`/order/${ptk.id}`, null, true);
		}
		dispatch({type: 'setDeliveryPayment', payload: ptk.freight});
		let group = await $.get('/group/' + id);
		dispatch({type: 'loadGroupById', payload: group});
		var comm = group.commodity;
		if(comm.model === 'ladder'){
			dispatch({type: 'setGroupMoney', payload: {
				price: comm.price,
				maxs: 0}
			})
			comm.ladder.prices.forEach((price, key) => {
				let money = getState().groupMoney;
				if(group.num_order >= price.people && money.maxs < price.people){
					dispatch({type: 'setGroupMoney', payload: {price: price.price, maxs: price.people}})
				}
			});
		}	
	}catch(e){
		widgets.Alert.add('danger', '没有该团的信息');
	}
}

const drawBack = id => dispatch => {
	$.post(`/partaker/${id}/ask/refund`).then(data => {
		widgets.Alert.add('success', data.message);
		// $state.reload();
	});
}

export default {
	partakersNextPage,
	resetPartakerAndNextPage,
	loadPartakerById,
	findPartakerAndGroupByGroupIdAndUserId,
	drawBack
};