const orderQrcode = (orderQrcode = null, action) => {
	switch(action.type){
		case 'setOrderQrcode':
			return action.payload;
		default: 
			return orderQrcode;
	}
}

export default {
	orderQrcode
}