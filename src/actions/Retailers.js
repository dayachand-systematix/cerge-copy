import axios from 'axios';
import {
    RETAILER_API_REQUEST,
    RETAILER_API_FAILURE,
    ACCEPTED_RETAILER_LISTING,
    REMOVED_RETAILER_LISTING,
    HIDE_RETAILER_FROM_REMOVED,
    SET_SELECTED_TAB,
    UPDATE_RETAILER_LOYALTY
} from '../constants';

import { API } from '../config';
import { apiErrors } from '../helper';
import { formatInvitationResponse } from '../utils/ApiResponse';

const headers = {
    'Content-Type': 'application/json'
};

/**
 * @method getRetailersListAction
 * @description used to get retailers list (accepted and removed both)
 */
export function getRetailersListAction(requestData, callback) {
    return dispatch => {
        dispatch({ type: RETAILER_API_REQUEST });
        const ACCEPTED = axios.post(API.GetAcceptedInvitation, requestData, { headers });
        const REMOVED = axios.post(API.GetRemovedInvitation, requestData, { headers });
        Promise.all([ACCEPTED, REMOVED])
            .then((response) => {
                if (apiErrors(response[0] || apiErrors(response[1]))) {
                    dispatch({ type: RETAILER_API_FAILURE });
                    callback(false);
                } else {
                    const acceptedRatailers =
                        (response[0].data.data && response[0].data.data.acceptedRetailers)
                            ? formatInvitationResponse(response[0].data.data.acceptedRetailers) : [];
                    const rejectedRatailers =
                        (response[1].data.data && response[1].data.data.removedRetailers)
                            ? formatInvitationResponse(response[1].data.data.removedRetailers) : [];
                    console.log('acceptedRatailers', acceptedRatailers);
                    dispatch({
                        type: ACCEPTED_RETAILER_LISTING,
                        payload: acceptedRatailers
                    });
                    dispatch({
                        type: REMOVED_RETAILER_LISTING,
                        payload: rejectedRatailers
                    });
                    callback(response);
                }
            })
            .catch(error => {
                callback(false);
                dispatch({ type: RETAILER_API_FAILURE });
                apiErrors(error);
            });
    };
}

/**
 * @method getAcceptedRetailersListAction
 * @description used to get retailers list (accepted)
 */
export function getAcceptedRetailersListAction(requestData, pullToRefresh, callback) {
    return dispatch => {
        dispatch({ type: pullToRefresh ? RETAILER_API_FAILURE : RETAILER_API_REQUEST });
        const request = axios.post(API.GetAcceptedInvitation, requestData, { headers });
        request
            .then((response) => {
                if (apiErrors(response)) {
                    dispatch({ type: RETAILER_API_FAILURE });
                    callback(false);
                } else {
                    const acceptedRatailers =
                        (response.data.data && response.data.data.acceptedRetailers)
                            ? formatInvitationResponse(response.data.data.acceptedRetailers) : [];
                    callback(response);
                    dispatch({
                        type: ACCEPTED_RETAILER_LISTING,
                        payload: acceptedRatailers
                    });
                }
            })
            .catch(error => {
                callback(false);
                dispatch({ type: RETAILER_API_FAILURE });
                apiErrors(error);
            });
    };
}

/**
 * @method getRejectedRetailersListAction
 * @description used to get retailers list (removed)
 */
export function getRejectedRetailersListAction(requestData, pullToRefresh, callback) {
    return dispatch => {
        dispatch({ type: pullToRefresh ? RETAILER_API_FAILURE : RETAILER_API_REQUEST });
        const request = axios.post(API.GetRemovedInvitation, requestData, { headers });
        request
            .then((response) => {
                if (apiErrors(response)) {
                    dispatch({ type: RETAILER_API_FAILURE });
                    callback(false);
                } else {
                    const rejectedRatailers =
                        (response.data.data && response.data.data.removedRetailers)
                            ? formatInvitationResponse(response.data.data.removedRetailers) : [];
                    dispatch({
                        type: REMOVED_RETAILER_LISTING,
                        payload: rejectedRatailers
                    });
                    callback(response);
                }
            })
            .catch(error => {
                callback(false);
                dispatch({ type: RETAILER_API_FAILURE });
                apiErrors(error);
            });
    };
}

/**
 * @method hideAcceptedAction
 * @description used to hide the retailers
 */
export function hideAcceptedAction(requestData) {
    return dispatch => {
        dispatch({ type: HIDE_RETAILER_FROM_REMOVED, payload: requestData });
    };
}

/**
 * @method setSelectedTabAction
 * @description used to select the current tab
 */
export function setSelectedTabAction(tab) {
    return dispatch => {
        dispatch({ type: SET_SELECTED_TAB, payload: tab });
    };
}

/**
 * @method updateLoyaltyNumberAction
 * @description used to update loyalty number
 */
export function updateLoyaltyNumberAction(requestData, callback) {
    return dispatch => {
        dispatch({ type: RETAILER_API_REQUEST });
        const request = axios.post(API.updateLoyaltyNumber, requestData, { headers });
        request
            .then((response) => {
                if (apiErrors(response)) {
                    dispatch({ type: RETAILER_API_FAILURE });
                    callback(false);
                } else {
                    dispatch({
                        type: UPDATE_RETAILER_LOYALTY,
                    });
                    callback(response);
                }
            })
            .catch(error => {
                callback(false);
                dispatch({ type: RETAILER_API_FAILURE });
                apiErrors(error);
            });
    };
}
