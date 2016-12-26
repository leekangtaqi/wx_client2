const initPartakers = {
	items: [],
  busy: false,
  loaded: false,
  page: 1,
  limit: 10,
  params: {},
	count: 0
}
const partakers = (partakers = initPartakers, action) => {
	switch(action.type){
		case 'resetPartakers':
			return initPartakers;
		case 'partakersSetParams':
			return Object.assign({}, partakers, {params: action.payload});
		case 'partakersNextPage':
			return Object.assign({}, partakers, {items: [...partakers.items, ...action.payload.items], page: partakers.page+1, count: action.payload.count});
		case 'partakersBusy':
			return Object.assign({}, partakers, {busy: true});
		case 'partakersUnBusy':
			return Object.assign({}, partakers, {busy: false});
		case 'addPartakers':
			return Object.assign({}, partakers, {items: [...partakers.items, ...action.payload]});
		case 'partakersLoaded':
		  return Object.assign({}, partakers, {loaded: action.payload});
		default: 
			return partakers;
	}
}

const partaker = (partaker = {}, action) => {
	switch(action.type){
		case 'setPartaker':
			return Object.assign({}, action.payload);
		default: 
			return partaker;
	}
}

const partakerQrcode = (partakerQrcode = {}, action) => {
	switch(action.type){
		case 'setPartakerQrcode':
			return action.payload || partakerQrcode;
		default:
			return partakerQrcode;
	}
}


export default {
	partakers,
	partaker,
	partakerQrcode
}