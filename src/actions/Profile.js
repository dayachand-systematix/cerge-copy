/* import { AsyncStorage } from 'react-native'; */
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {
    PROFILE_API_REQUEST,
    PROFILE_API_FAILURE,
    UPDATE_USER_PROFILE_SUCCESS,
    GET_USER_PREFERENCES_SUCCESS,
    FETCH_USER_DATA,
    USER_PROFILE_IMAGE_SUCCESS,
    GET_USER_PROFILE_SUCCESS,
    CLEAR_USER_DATA,
    GET_SYSTEM_CONFIG_SUCCESS
} from '../constants';
import { API } from '../config';
import { apiErrors, httpErrors } from '../helper';

/**
 * @method updateUserProfileAPI
 * @description update user profile data
 */
export function updateUserProfileAPI(requestData, userId, callback) {
    return dispatch => {
        dispatch({ type: PROFILE_API_REQUEST });
        axios
            .put(API.updateUserProfile + userId, requestData)
            .then(response => {
                updateAsyncStorage(dispatch, requestData, () => {
                    dispatch(getUserProfileUpdateSuccess(response));
                    callback(response);
                });
            })
            .catch(error => {
                apiErrors(error);
                dispatch({ type: PROFILE_API_FAILURE });
            });
    };
}

/**
 * @method getUserProfileUpdateSuccess
 * @description return object containing action type
 */
export function getUserProfileUpdateSuccess() {
    return {
        type: UPDATE_USER_PROFILE_SUCCESS
    };
}

export function clearUserData() {
    return dispatch => {
        dispatch({ type: CLEAR_USER_DATA });
    };
}

function updateAsyncStorage(dispatch, updateData, callback) {
    AsyncStorage.multiGet(['LOGGEDUSER', 'CURRENTROLES']).then(value => {
        if (value !== null) {
            const loggedUser = JSON.parse(value[0][1]);
            const userData = {
                ...loggedUser,
                ...updateData
            };
            const userDataValue = {
                loggedUser: userData,
                curentRoles: JSON.parse(value[1][1])
            };
            AsyncStorage.setItem('LOGGEDUSER', JSON.stringify(userData)).then(() => {
                dispatch({
                    type: FETCH_USER_DATA,
                    payload: userDataValue
                });
                callback();
            });
        }
    });
}

/**
 * @method onUploadUserProfileImageAPI
 * @description used to upload user profile image
 */

export function onUploadUserProfileImageAPI(requestData, callback) {
    return dispatch => {
        dispatch({ type: PROFILE_API_REQUEST });
        let formData = new FormData();
        formData.append('image', requestData);
        const multipartHeaders = {
            'Content-Type':
                'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        };
        axios
            .post(`${API.updateUserProfile}${requestData.userId}/image`, formData, {
                multipartHeaders
            })
            .then(response => {
                dispatch({ type: USER_PROFILE_IMAGE_SUCCESS });
                callback(response);
            })
            .catch(error => {
                dispatch({ type: PROFILE_API_FAILURE });
                apiErrors(error);
            });
    };
}

/* *************************New Action creator for Cerge App ***************** */
/**
 * @method getUserProfileAction
 * @description used to get user profile details
 */

export function getUserProfileAction(callback) {
    return dispatch => {
        dispatch({ type: PROFILE_API_REQUEST });
        const request = axios.post(API.GetUserProfile, {deviceToken: ""});
        request.then(response => {
            if (apiErrors(response)) {
                dispatch({ type: PROFILE_API_FAILURE });
                callback(false);
            } else {
                if (response.data) {
                    console.log('getUserProfileAction', response.data)
                    dispatch({
                        type: GET_USER_PROFILE_SUCCESS,
                        payload: response.data && response.data.data != null && response.data.data.userProfile ? response.data.data.userProfile : {}
                    });
                    callback(response);
                } else {
                    console.log('getUserProfileAction false')
                    callback(false);
                }
            }
        })
            .catch(error => {
                console.log('getUserProfileAction error', error);
                httpErrors(error);
                dispatch({ type: PROFILE_API_FAILURE });
                callback(false);
            });
    };
}

/**
 * @method setUserData
 * @description used to set or update the user data
 */
export function setUserData(userProfile) {
    return dispatch => {
        dispatch({
            type: GET_USER_PROFILE_SUCCESS,
            payload: userProfile
        });
    };
}

/**
 * @method getUserProfileAction
 * @description used to get user profile details
 */
export function updateUserProfileAction(requestData, callback) {
    console.log('requestData updateUserProfileAction', requestData);
    return dispatch => {
        dispatch({ type: PROFILE_API_REQUEST });
        const request = axios.post(API.UpdateUserBasicInfo, requestData);
        request
            .then(response => {
                if (apiErrors(response)) {
                    dispatch({ type: PROFILE_API_FAILURE });
                    callback(response);
                } else {
                    dispatch({
                        type: UPDATE_USER_PROFILE_SUCCESS
                    });
                    callback(response);
                }
            })
            .catch(error => {
                dispatch({ type: PROFILE_API_FAILURE });
                httpErrors(error);
                callback(error);
            });
    };
}

/**
 * @method getPreferenceConfigAction
 * @description get User Shopping config prefrences
 */
export function getPreferenceConfigAction() {
    return dispatch => {
        dispatch({ type: PROFILE_API_REQUEST });
        axios
            .get(API.GetPreferenceConfig)
            .then(response => {
                if (apiErrors(response)) {
                    dispatch({ type: PROFILE_API_FAILURE });
                } else {
                    dispatch({
                        type: GET_USER_PREFERENCES_SUCCESS,
                        payload: response.data.data.config
                    });
                }
            })
            .catch(error => {
                apiErrors(error);
                dispatch({ type: PROFILE_API_FAILURE });
            });
    };
}

/**
 * @method getSystemConfigAction
 * @description get system config prefrences
 */
export function getSystemConfigAction(callback) {
    return dispatch => {
        dispatch({ type: PROFILE_API_REQUEST });
        axios
            .get(API.GetSysConfig)
            .then(response => {
                console.log('getSystemConfigAction response', response.data.data.sysConfig);
                if (apiErrors(response)) {
                    dispatch({ type: PROFILE_API_FAILURE });
                    callback();
                } else {
                    dispatch({
                        type: GET_SYSTEM_CONFIG_SUCCESS,
                        payload: response.data.data.sysConfig.ConfigSetting
                    });
                    AsyncStorage.setItem('configSetting', JSON.stringify(response.data.data.sysConfig.ConfigSetting));
                    callback();
                }
            })
            .catch(error => {
                apiErrors(error);
                callback();
                dispatch({ type: PROFILE_API_FAILURE });
            });
    };
}
