import {
    SHOPPING_API_REQUEST,
    SHOPPING_API_FAILURE,
    SHOPPING_UPDATE
} from '../constants';

/** Define initialState for reducer so that we don't get undefined values */
const initialState = {
    error: false,
    shoppingLoading: false,
};

/**
* @method authReducer
* @description Takes previous state and returns the new state
* @param {*} state 
* @param {*} action 
*/
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case SHOPPING_API_REQUEST:
            return {
                ...state,
                shoppingLoading: true
            };
        case SHOPPING_API_FAILURE:
            return {
                ...state,
                shoppingLoading: false,
                error: true
            };
        case SHOPPING_UPDATE:
            return {
                ...state,
                shoppingLoading: false,
                shoppingUpdate: action.payload,
                error: true
            };
        default:
            return state;
    }
}
