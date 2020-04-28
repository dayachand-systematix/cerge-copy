import axios from 'axios';
import {
    REVIEW_API_REQUEST,
    REVIEW_API_FAILURE,
    REVIEW_HISTORY_LISTING,
    REVIEW_RATING
} from '../constants';

import { API } from '../config';
import { apiErrors } from '../helper';
import { formatGetShoppingHistoryResult } from '../utils/ApiResponse';

const headers = {
    'Content-Type': 'application/json'
};

/**
* @method getShoppingHistoryAction
* @description used to get user's review list 
*/
export function getShoppingHistoryAction(
    requestData,
    pullToRefresh = false,
    loadMore = false,
    callback) {
    return dispatch => {
        if (!pullToRefresh) {
            dispatch({ type: REVIEW_API_REQUEST });
        }
        const request = axios.post(API.GetShoppingHistory, requestData, { headers });
        request
            .then(response => {
                if (apiErrors(response)) {
                    dispatch({ type: REVIEW_API_FAILURE });
                    callback(false);
                } else {
                    const shoppingHistoryFormatedData =
                        formatGetShoppingHistoryResult(response.data, requestData.pageIndex);
                    console.log('shoppingHistoryFormatedData', shoppingHistoryFormatedData);
                    dispatch({
                        type: REVIEW_HISTORY_LISTING,
                        payload: shoppingHistoryFormatedData,
                        loadMore,
                    });
                    callback(response);
                }
            })
            .catch(error => {
                console.log('getShoppingHistoryAction error', error);
                dispatch({ type: REVIEW_API_FAILURE });
                callback(error);
                apiErrors(error);
            });
    };
}

/**
 * @method setShoppingRatingAction
 * @description used to get user invitation list
 */
export function setShoppingRatingAction(requestData, callback) {
    return dispatch => {
        dispatch({ type: REVIEW_API_REQUEST });
        const request = axios.post(API.SetShoppingRating, requestData, { headers });
        request
            .then(response => {
                if (apiErrors(response)) {
                    console.log('setShoppingRatingAction response1', response.data.Code);
                    dispatch({ type: REVIEW_API_FAILURE });
                    callback(false);
                } else {
                    console.log('REVIEW_LISTING response', response);
                    dispatch({
                        type: REVIEW_RATING,
                        payload: requestData
                    });
                    callback(response);
                }
            })
            .catch(error => {
                console.log('setShoppingRatingAction error', error);
                dispatch({ type: REVIEW_API_FAILURE });
                callback(error);
                apiErrors(error);
            });
    };
}
