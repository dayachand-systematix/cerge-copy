import axios from 'axios';
import {
    INVITATION_API_REQUEST,
    INVITATION_API_FAILURE,
    INVITATION_LISTING,
    INVITATION_FILTER_LISTING,
    HIDE_RETAILER_INVITATION,
    ACCEPT_RETAILER__INVITATION,
    INVITATION_DETAIL_REQUEST,
    INVITATION_DETAIL_FAILURE,
    INVITATION_DETAIL,
    ACCEPTED_RETAILER_LISTING,
    HIDE_INVITATION_FROM_REMOVED,
    LOADER_SHOW_HIDE,
    INVITATION_FILTER_REQUEST_CLEAR,
    RESET_PING
} from '../constants';

import { API } from '../config';
import { apiErrors, httpErrors } from '../helper';
import { formatInvitationResponse, formatSearchNearMeResult } from '../utils/ApiResponse';

const headers = {
    'Content-Type': 'application/json'
};

/**
 * @method getInvitationListAction
 * @description used to get user invitation list
 */
export function getInvitationListAction(requestData, pullToRefresh, callback) {
    console.log('getInvitationListAction requestData', requestData);
    return dispatch => {
        dispatch({ type: pullToRefresh ? INVITATION_API_FAILURE : INVITATION_API_REQUEST });
        const request = axios.post(API.GetNewInvitationList, requestData, { headers });
        request
            .then(response => {
                console.log('getInvitationListAction response', response);
                if (apiErrors(response)) {
                    dispatch({ type: INVITATION_API_FAILURE });
                    callback(false);
                } else {
                    const formatedData = (response.data.data &&
                        response.data.data.newRetailers) ?
                        formatInvitationResponse(response.data.data.newRetailers) : [];
                    dispatch({
                        type: INVITATION_LISTING,
                        payload: [formatedData, requestData]
                    });
                    callback(response);
                }
            })
            .catch(error => {
                dispatch({ type: INVITATION_API_FAILURE });
                callback(error);
                apiErrors(error);
            });
    };
}

/**
 * @method clearFilterRequestData
 * @description dispatch the empty object to clear filter request data
 */
export function clearFilterRequestData() {
    return (dispatch) => {
        dispatch({
            type: INVITATION_FILTER_REQUEST_CLEAR,
            payload: {}
        });
    };
}

/**
 * @method acceptInvitationAction
 * @description used for accepting invitations
 */
export function acceptInvitationAction(requestData, callback) {
    return dispatch => {
        dispatch({ type: INVITATION_API_REQUEST });
        const request = axios.post(API.AcceptInvitation, requestData, { headers });
        request
            .then(response => {
                if (apiErrors(response)) {
                    dispatch({ type: INVITATION_API_FAILURE });
                    callback(false);
                } else {
                    dispatch({
                        type: ACCEPT_RETAILER__INVITATION,
                    });
                    callback(response);
                }
            })
            .catch(error => {
                dispatch({ type: INVITATION_API_FAILURE });
                callback(error);
                httpErrors(error);
            });
    };
}

/**
 * @method rejectInvitationAction
 * @description used to get user profile details
 */
export function rejectInvitationAction(requestData, callback) {
    return dispatch => {
        dispatch({ type: INVITATION_API_REQUEST });
        const request = axios.post(API.RejectInvitation, requestData, { headers });
        request
            .then(response => {
                if (apiErrors(response)) {
                    dispatch({ type: INVITATION_API_FAILURE });
                    callback(false);
                } else {
                    dispatch({
                        type: HIDE_RETAILER_INVITATION,
                    });
                    callback(response);
                }
            })
            .catch(error => {
                dispatch({ type: INVITATION_API_FAILURE });
                callback(error);
                apiErrors(error);
            });
    };
}

/**
 * @method getInvitationDetail
 * @description used to get the Invitation details
 */
export function getInvitationDetail(invitationId) {
    return dispatch => {
        dispatch({ type: INVITATION_DETAIL_REQUEST });
        const request = axios.get(`${API.GetInvitationDetail}?InvitationId=${invitationId}`);
        request
            .then(response => {
                console.log('getInvitationDetail ', response);
                if (apiErrors(response)) {
                    dispatch({ type: INVITATION_DETAIL_FAILURE });
                } else {
                    dispatch({
                        type: INVITATION_DETAIL,
                        payload: response.data.data
                    });
                }
            })
            .catch(error => {
                dispatch({ type: INVITATION_DETAIL_FAILURE });
                httpErrors(error);
            });
    };
}

/**
 * @method getSearchNearMeListAction
 * @description used to get user invitation list based on search in filter API of google ma[]
 */
export function getSearchNearMeListAction(requestData, pullToRefresh = false, callback = false) {
    return dispatch => {
        dispatch({ type: pullToRefresh ? INVITATION_API_FAILURE : INVITATION_API_REQUEST });
        const request = axios.post(
            `${'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='}${requestData.latitude}${','}${requestData.longitude}${'&radius='}${requestData.radius}${'&type='}${requestData.type}${'&key='}${requestData.key}`
        );
        request
            .then(response => {
                const formatedData = response.data ?
                    formatSearchNearMeResult(response.data) : [];
                dispatch({
                    type: INVITATION_FILTER_LISTING,
                    payload: formatedData

                });
            })
            .catch(error => {
                dispatch({ type: INVITATION_API_FAILURE });
                apiErrors(error);
            });
    };
}


export function hideInvitationAction(requestData) {
    return dispatch => {
        dispatch({ type: HIDE_INVITATION_FROM_REMOVED, payload: requestData });
    };
}

/**
 * @method tempRetailerAPIAction
 * @description AC for temp use for action creator with promise.
 */
export function tempRetailerAPIAction(requestData1, requestData2) {
    return dispatch => {
        dispatch({ type: INVITATION_API_REQUEST });
        const request1 = axios.post(API.RejectInvitation, requestData1, { headers });
        const request2 = axios.post(API.GetAcceptedInvitation, requestData2, { headers });
        const request3 = axios.post(API.GetNewInvitationList, requestData2, { headers });
        Promise.all([request1, request2, request3])
            .then(response => {
                console.log('requestData2', response);

                if (apiErrors(response)) {
                    dispatch({ type: INVITATION_API_FAILURE });
                } else {
                    const acceptedRatailers =
                        (response[1].data.data && response[1].data.data.acceptedRetailers)
                            ? formatInvitationResponse(response[1].data.data.acceptedRetailers) : [];
                    dispatch({
                        type: ACCEPTED_RETAILER_LISTING,
                        payload: acceptedRatailers
                    });

                    const formatedData = (response[2].data.data &&
                        response[2].data.data.newRetailers) ?
                        formatInvitationResponse(response[2].data.data.newRetailers) : [];
                    dispatch({
                        type: INVITATION_LISTING,
                        payload: [formatedData, requestData2]
                    });
                }
            })
            .catch(error => {
                dispatch({ type: INVITATION_API_FAILURE });
                apiErrors(error);
            });
    };
}

export function loaderShowHide(data) {
    return dispatch => {
        dispatch({ type: LOADER_SHOW_HIDE, payload: data });
    };
}

