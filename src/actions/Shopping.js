import axios from 'axios';
import {
    SHOPPING_API_FAILURE,
    SHOPPING_API_REQUEST,
    SHOPPING_UPDATE
} from '../constants';

import { API } from '../config';
import { apiErrors, httpErrors } from '../helper';

/**
 * @method UpdateShoppingStatusAction
 * @description used to submit shopping status
 */
export function UpdateShoppingStatusAction(requestData, callback) {
    return dispatch => {
        dispatch({ type: SHOPPING_API_REQUEST });
        const request = axios.post(API.UpdateUserShoppingStatus, requestData);
        request
            .then(response => {
                if (apiErrors(response)) {
                    dispatch({ type: SHOPPING_API_FAILURE });
                    callback(false);
                } else {
                    dispatch({
                        type: SHOPPING_UPDATE,
                        payload: requestData
                    });
                    callback(response);
                }
            })
            .catch(error => {
                httpErrors(error);
                dispatch({ type: SHOPPING_API_FAILURE });
                callback(error);
            });
    };
}
