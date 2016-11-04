const nextPage = () => (dispatch, getState) => {    
    if(getState().bills.busy) return;
    dispatch({type: 'billsBusy', payload: true});
    let params = getState().bills.params;
    Object.assign(params, {limit: getState().bills.limit, page: getState().bills.page});
    $.get(`/bill?${$.util.querystring.stringify(params)}`).then(data=>{
        let count = data[0];
        var items = data[1];
        dispatch({type: 'addBills', payload: items});
        dispatch({type: 'billsNextPage'});
        if((getState().bills.items.length + items.length) >= count){
            dispatch({type: 'billsBusy', payload: true});
            return;
        }
        dispatch({type: 'billsUnBusy', payload: true});
    })
}

export default {
    nextPage
}