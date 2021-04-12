const initialState = {
    token:[],
}

function usersReducer(state = initialState, action) {
    switch (action.type) {
        case 'CANCEL_TOKEN_REQUEST':{
            var tmp = initialState.token;
            tmp.push(action.payload);
            return {
                ...state
            }
        }
        case 'GET_CANCEL_TOKEN':{
            var tmp = initialState.token;
            return state;
        }
        default:
            return state;
    }
}
export default usersReducer;