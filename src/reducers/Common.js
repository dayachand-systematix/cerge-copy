import {
    COMMON_API_REQUEST,
    COMMON_API_FAILURE,
    FETCH_STORE_DATA, ENTER_STORE, LEAVE_STORE, SET_NEAR_STORE, SET_OUT_STORE
} from '../constants';
import {DEFAULT_PING_TIME} from "../config/index";

/** Define initialState for reducer so that we don't get undefined values */
const initialState = {
    error: false,
    loading: false,
    storeData: {},
    storeHistoryId: '',
    nearStoreData: '',
    defaultTime: 0,
    resetPing: false
};

/**
* @method authReducer
* @description Takes previous state and returns the new state
* @param {*} state 
* @param {*} action 
*/
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case COMMON_API_REQUEST:
            return {
                ...state,
                loading: true
            };
        case COMMON_API_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            };
        case FETCH_STORE_DATA:
            return {
                ...state,
                loading: false,
                storeData: action.payload
            };
        case ENTER_STORE:
            return {
                ...state,
                loading: false,
                nearStoreData: '',
                storeHistoryId: action.payload,
                defaultTime: 60000,
            };
        case LEAVE_STORE:
            return {
                ...state,
                loading: false,
                storeHistoryId: '',
                defaultTime: 0,
            };
        case SET_NEAR_STORE:
            return {
                ...state,
                loading: false,
                nearStoreData: action.payload,
                defaultTime: 0,
            };
        case SET_OUT_STORE:
            return {
                ...state,
                loading: false,
                outStoreData: action.payload,
                defaultTime: 0,
            };
        default:
            return state;
    }
}
