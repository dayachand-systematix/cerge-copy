import {
    RETAILER_API_REQUEST,
    RETAILER_API_FAILURE,
    ACCEPTED_RETAILER_LISTING,
    REMOVED_RETAILER_LISTING,
    HIDE_RETAILER_FROM_REMOVED,
    SET_SELECTED_TAB,
    UPDATE_RETAILER_LOYALTY
} from '../constants';

/** Define initialState for reducer so that we don't get undefined values */
const initialState = {
    error: false,
    retailerLoading: false,
    acceptedRetailerListing: [],
    removedRetailerListing: [],
    selectedTab: 'AcceptedRetailers'
};

/**
* @method authReducer
* @description Takes previous state and returns the new state
* @param {*} state 
* @param {*} action 
*/
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case RETAILER_API_REQUEST:
            return {
                ...state,
                retailerLoading: true
            };
        case SET_SELECTED_TAB:
            return {
                ...state,
                selectedTab: action.payload
            };
        case RETAILER_API_FAILURE:
            return {
                ...state,
                retailerLoading: false,
                error: true
            };
        case UPDATE_RETAILER_LOYALTY:
            return {
                ...state,
                retailerLoading: false,
            };
        case ACCEPTED_RETAILER_LISTING:
            return {
                ...state,
                retailerLoading: false,
                acceptedRetailerListing: action.payload
            };
        case REMOVED_RETAILER_LISTING:
            return {
                ...state,
                retailerLoading: false,
                removedRetailerListing: action.payload
            };
        case HIDE_RETAILER_FROM_REMOVED:
            const data = state.removedRetailerListing.filter((retailers) => retailers.invitationId !== action.payload.invitationId);
            return {
                ...state,
                retailerLoading: action.payload && action.payload.loader ? true : false,
                removedRetailerListing: data
            };
        default:
            return state;
    }
}
