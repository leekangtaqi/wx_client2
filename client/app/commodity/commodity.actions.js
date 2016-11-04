const nextPage = commodityList => async (dispatch, getState) => {
	if (commodityList.busy) return;
	dispatch({type: 'commodityListBusy'});
	var query = {page: commodityList.page, limit:commodityList.limit};
	if(commodityList.params && commodityList.params.tips){
		query.tips = true;
	}
	let data = await $.get('/commodity?' + $.util.querystring.stringify(query));
	if(!data.length){
		return dispatch({type: 'commodityListUnBusy'});
	}
	dispatch({type: 'addCommodityList', payload: data});
	if(data.length < commodityList.limit){
		dispatch({type: 'commodityListBusy'});
		return;
	}
	dispatch({type: 'commodityListNextPage'});
	dispatch({type: 'commodityListUnBusy'});
};

let viewPort = {
	capacity: 10
}
/**
 * 视口
 */
const updateCommList = (pos, append) => (dispatch, getState) => {
	/**
	 * 当前位置和之前的做比较
	 */
	let state = getState();
	let viewPortHeight = document.body.clientHeight;
	let commList = state.commdityListView.list;
	let fullCommList = state.commodityList.items;
	let direction = state.scroll.direction;
	let marginTop = state.commdityListView.marginTop;
	let distinct = pos - marginTop;
	let index = state.commdityListView.index;
	let gap = state.commdityListView.capacity / 2 - 1;
	if(direction === 'down' && commList[0] && distinct > commList[0].height){
		console.warn('scroll down');
		let height = 0;
		let count = 0;
		for(var i=0, len=commList.length; i<len; i++){
			if(height + commList[i].height <= distinct){
				height = height + commList[i].height;
				count+=1;
			}else{
				break;
			}
		}
		//forword count items
		if(count > gap){
			let supply = count - gap;
			let newList = fullCommList.slice(index + supply, state.commdityListView.capacity);
			console.warn(newList);
			dispatch({type: 'updateCommdityListViewMarginTop', payload: marginTop + commList.filter((c, i)=>i<supply).reduce((a, c)=>a + c.height, 0)});
			dispatch({type: 'updateCommdityListViewList', payload: newList});
			dispatch({type: 'updateCommdityListViewIndex', payload: index + 1});
		}
	}
	else if(direction === 'up' && commList[commList.length - 1] && distinct > commList[commList.length - 1].height){
		console.warn('....')
	}
	if(append){
		// console.warn(append);
		dispatch({type: 'updateCommdityListViewList', payload: append})
	}
}

const appendItems = (items, getState, dispatch) => {
	let state = getState();
	let list = state.commdityListView.list;
	let capacity = state.commdityListView.capacity;
	let appendNum = capacity - list.length;
	let newList = [...list, ...items.slice(0, appendNum)];
	dispatch({type: 'updateCommdityListViewList', payload: newList});
}

const scrollToReloadComms = () => {
	
}

const changeCommId = commId => ({type: 'changeCommId', payload: commId});

const getComm = id => $.get('/commodity/' + id).then(data => ({type: 'getComm', payload: data}));

const getCommInfoAlbums = (id, done) => dispatch => {
	$.get('/album/commodity/' + id).then(data => {
		dispatch({type: 'getCommInfoAlbums', payload: data})
		done && setTimeout(done, 0);
	})
}

const getCommCities = province => async (dispatch, getState) => {
	let py = province.py;
	dispatch({type: 'updateCommGroupAddress', payload: {province: province}});
	let data = await $.get('/address/city?province=' + py);
	dispatch({type: 'changeCommCities', payload: data.city});	
	let address = getState().commGroupAddress;
	let city =  getState().commSelectArea;
	if(address.city){
		data.city && data.city.forEach((val, key) => {
			if(val.id === address.city.id){
				dispatch({type: 'updateCommGroupAddress', payload: {city: val}});
				if(address.district){
					city.district && city.district.forEach((val,key) => {
						if(val.id === address.district.id){
							dispatch({type: 'updateCommGroupAddress', payload: {district: val}});
						}
					});
				}
			}
		})
	}
}

const fetchCommGroupAddress = callback => (dispatch, getState) => {
	$.get('/address').then(data=>{
		dispatch({type: 'initCommGroupAddress', payload: data})
		if(data.province){
			getState().commProvinces.forEach((val, key)=>{
				if(val.id === data.province.id){
					dispatch(getCommCities(val));
				}
			})
		}
		callback(data);
	})
}

const updateCommGroupAddress = meta => {
	return {
		type: 'updateCommGroupAddress',
		payload: meta
	}
}

const getCommProvinces = () => ({type: 'getCommProvinces', payload: ''});

export default {
	nextPage, 
	updateCommList,
	getComm, 
	getCommInfoAlbums,
	changeCommId, 
	getCommProvinces, 
	getCommCities,
	updateCommGroupAddress,
	fetchCommGroupAddress,
	scrollToReloadComms
};