import {
    INVITATION_API_REQUEST,
    INVITATION_API_FAILURE,
    INVITATION_LISTING,
    INVITATION_FILTER_LISTING,
    HIDE_RETAILER_INVITATION,
    ACCEPT_RETAILER__INVITATION, INVITATION_DETAIL_REQUEST,
    INVITATION_DETAIL_FAILURE, INVITATION_DETAIL,
    HIDE_INVITATION_FROM_REMOVED,
    LOADER_SHOW_HIDE,
    INVITATION_FILTER_REQUEST_CLEAR
} from '../constants';

/** Define initialState for reducer so that we don't get undefined values */
const initialState = {
    error: false,
    invitationLoading: false,
    invitationListing: [],
    invitationFilterListing: [],
    invitationDetail: {},
    invitationFilterRequestData: {}
};

/**
* @method authReducer
* @description Takes previous state and returns the new state
* @param {*} state 
* @param {*} action 
*/
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case INVITATION_API_REQUEST:
            return {
                ...state,
                invitationLoading: true
            };
        case INVITATION_API_FAILURE:
            return {
                ...state,
                invitationLoading: false,
                error: true
            };
        case INVITATION_LISTING:
            return {
                ...state,
                invitationLoading: false,
                invitationListing: action.payload[0],
                invitationFilterRequestData: action.payload[1]
            };
        case INVITATION_FILTER_REQUEST_CLEAR:
            return {
                ...state,
                invitationFilterRequestData: action.payload
            };
        case INVITATION_FILTER_LISTING:
            return {
                ...state,
                invitationLoading: false,
                invitationFilterListing: action.payload
            };
        case HIDE_RETAILER_INVITATION:
            return {
                ...state,
                invitationLoading: false
            };
        case ACCEPT_RETAILER__INVITATION:
            return {
                ...state,
                invitationLoading: false
            };
        case INVITATION_DETAIL_REQUEST:
            return {
                ...state,
                invitationLoading: true,
                invitationDetail: {}
            };
        case INVITATION_DETAIL_FAILURE:
            return {
                ...state,
                invitationLoading: false,
                error: true,
                invitationDetail: {}
            };
        case INVITATION_DETAIL:
            return {
                ...state,
                invitationLoading: false,
                invitationDetail: action.payload
            };
        case HIDE_INVITATION_FROM_REMOVED:
            const data = state.invitationListing.filter((invitations) => invitations.invitationId !== action.payload.invitationId);
            return {
                ...state,
                invitationLoading: false,
                invitationListing: data
            };
        case LOADER_SHOW_HIDE:
            return {
                ...state,
                invitationLoading: action.payload
            };
        default:
            return state;
    }
}
