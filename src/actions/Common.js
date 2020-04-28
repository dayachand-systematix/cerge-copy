/* import { AsyncStorage } from 'react-native'; */
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import { FETCH_USER_DATA } from "../constants";
import { API, STATUS_CODES } from "../config";
import { apiErrors, httpErrors } from "../helper";

const headers = {
  "Content-Type": "application/json"
};

/**
 * @method updateUserData
 * @description update data in store on app landing
 */
export function updateUserData() {
  return dispatch => {
    dispatch({ type: "Nothing" });
    AsyncStorage.multiGet(["LOGGEDUSER", "CURRENTROLES"]).then(value => {
      if (value !== null) {
        const userDataValue = {
          loggedUser: JSON.parse(value[0][1]),
          curentRoles: JSON.parse(value[1][1])
        };
        dispatch({
          type: FETCH_USER_DATA,
          payload: userDataValue
        });
      }
    });
  };
}

/**
 * @method pingClosestStoreAction
 * @description to get the closest distance of the user
 */
export function pingClosestStoreAction(requestData, callback) {
  console.log("pingClosestStoreAction", requestData);
  return () => {
    const request = axios.post(API.pingClosestStore, requestData, { headers });
    request
      .then(response => {
        console.log("pingClosestStoreAction action", response);
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.code == STATUS_CODES.OK
        ) {
          AsyncStorage.setItem('auth_token', response.data.token);
          axios.defaults.headers.common.Token = response.data.token;
          callback(response.data.data);
        } else {
          callback(false);
        }
      })
      .catch(error => {
        console.log("pingClosestStoreAction error", error);
        callback(false);
      });
  };
}

/**
 * @method enterStoreAction
 * @description to enter the user in the store
 */
export function enterStoreAction(data, callback) {
  return dispatch => {
    const request = axios.post(API.enterStore, data, { headers });
    request
      .then(response => {
        console.log("enterStoreAction action", response);
        callback(response.data);
      })
      .catch(error => {
        callback(error);
        httpErrors(error);
      });
  };
}

/**
 * @method leaveStoreAction
 * @description to leave the user from the store
 */
export function leaveStoreAction(data, callback) {
  return dispatch => {
    const request = axios.post(API.leaveStore, data, { headers });
    request
      .then(response => {
        console.log("leaveStoreAction action", response);
        callback(response.data);
      })
      .catch(error => {
        callback(error);
        httpErrors(error);
      });
  };
}
