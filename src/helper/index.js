/**
 * Create all the helper functions and classes inside helper folder
 * import them inside index.js
 * export and use them
 */

import { Toast as NativeBaseToast } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import {
  Alert,
  /*   AsyncStorage, */
  PermissionsAndroid,
  Platform
} from "react-native";
import Permissions from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import Moment from "moment";
import axios from "axios";
import NavigationService from "../services/navigator";
import { MESSAGES, STATUS_CODES, DEFAULT_PING_TIME } from "../config";

/** This ValidationComponent is used in Registration screen */
import ValidationComponent from "./validations";

export class Toast {
  /**
   * @method showToast
   * @description Use it to show toast. It internally uses Toast provided by Native Base
   * @param {string} message
   * @param {string} type : possible values : default | warning | success | danger
   * @param {string} position
   */
  static showToast(message = "", type = "default", position = "bottom") {
    NativeBaseToast.hide();
    NativeBaseToast.show({
      text: message,
      buttonText: "Okay",
      type,
      position,
      duration: 5000
    });
    //return false;
  }

  static clearToastInstance() {
    NativeBaseToast.toastInstance = null;
  }
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return `${day} ${monthNames[monthIndex]} ${year}`;
}

export function convertISOToUtcDate(date) {
  return Moment.utc(date).format("MM/DD/YYYY");
}

export function jsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    if (e instanceof SyntaxError) {
      Toast.showToast(e, "danger");
    } else {
      Toast.showToast(e, "danger");
    }
    return [];
  }
}

export function stripHtml(text) {
  return text.replace(/<[^>]+>/g, "");
}

export function convertDate(date) {
  return Moment(date).format("DD-MMM-YYYY hh:mm A");
}

let showConnectionAlert = true;
export function requestError(error) {
  if (error.code == "ECONNABORTED" && showConnectionAlert) {
    // alert(error.config.url);
    showConnectionAlert = false;
    Alert.alert(
      "Poor Connection",
      MESSAGES.POOR_CONNECTION,
      [
        {
          text: "OK",
          onPress: () => {
            showConnectionAlert = true;
          }
        }
      ],
      { cancelable: false }
    );
  }
}

export function validateText(text) {
  let newText = "";
  const numbers =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
  for (let i = 0; i < text.length; i++) {
    if (numbers.indexOf(text[i]) > -1) {
      newText += text[i];
    }
  }
  return newText;
}

export const displayDistance = value => {
  if (typeof value != 'undefined' && typeof value == 'number') {
    if (value <= 999) {
      return `${value.toFixed(2)} m`;
    } else if (value > 999) {
      const temp = value / 1000;
      return `${temp.toFixed(2)} km`;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

/* display each value */
export const displayValue = value => {
  if (
    typeof value != "undefined" &&
    typeof value != "object" &&
    value.trim() != ""
  ) {
    return value.trim();
  } else {
    return "N/A";
  }
};

export function onLogout() {
  AsyncStorage.removeItem("isLoggedIn");
  NavigationService.navigate("AuthLoading");
  Toast.showToast(MESSAGES.LOGOUT_SUCCESS, "success");
}

export const httpErrors = res => {
  if (
    res &&
    res.data &&
    res.data.error &&
    res.data.error.message &&
    res.data.error.message.value
  ) {
    Toast.showToast(res.data.error.message, "danger");
  } else if (res && res.response && res.response.status === 401) {
    Toast.showToast("You are unauthorized user, please login again.", "danger");
  } else if (res && res.response && res.response.status === 404) {
    Toast.showToast("404 error", "danger");
  } else if (res && res.response && res.response.status === 403) {
    Toast.showToast("403 error", "danger");
  } else if (
    res &&
    res.response &&
    (res.response.status === 500 ||
      res.response.status === 501 ||
      res.response.status === 503)
  ) {
    Toast.showToast("Server Error", "danger");
  } else if (res && res.code == "ECONNABORTED") {
    Toast.showToast(
      "Server is responding slow, please check your net connection.",
      "danger"
    );
  } else {
    Toast.showToast("Something went wrong please try again.", "danger");
  }
};

export const apiErrors = res => {
  if (
    res &&
    res.data.Code &&
    res.data.Code == STATUS_CODES.FORBIDDEN
  ) {
    Alert.alert(
      "Session Expired!",
      MESSAGES.SESSION_EXPIRED,
      [{ text: "OK", onPress: () => onLogout() }],
      { cancelable: false }
    );
    return true;
  } else if (
    res &&
    res.data &&
    res.data.error &&
    res.data.error.message &&
    res.data.error.message.value
  ) {
    Toast.showToast(res.data.error.message.value, "danger");
    return true;
  } else if (
    res &&
    res &&
    res.data &&
    res.data.error &&
    res.data.error.message &&
    res.data.error.message.value
  ) {
    Toast.showToast(res.data.error.message.value, "danger");
    return true;
  } else if (
    res &&
    res.data.Code &&
    res.data.Code == STATUS_CODES.BAD_REQUEST
  ) {
    Toast.showToast(MESSAGES.UNAUTHORIZED_USER, "danger");
    return true;
  } else if (
    res &&
    res.data.Code &&
    res.data.Code == STATUS_CODES.UNAUTHORIZED
  ) {
    Alert.alert(
      "Session Expired!",
      MESSAGES.SESSION_EXPIRED,
      [{ text: "OK", onPress: () => onLogout() }],
      { cancelable: false }
    );
    return true;
  } else if (res && res.data.Code && res.data.Code == STATUS_CODES.FORBIDDEN) {
    Toast.showToast(MESSAGES.SERVER_ERROR, "danger");
    return true;
  } else if (
    res &&
    res.data.Code &&
    (res.data.Code == STATUS_CODES.INTERNAL_SERVER_ERROR ||
      res.data.Code == STATUS_CODES.NOT_IMPLIMENTED ||
      res.data.Code == STATUS_CODES.SERVICE_UNAVAILABLE ||
      res.data.Code == STATUS_CODES.BAD_GATEWAY)
  ) {
    Toast.showToast(MESSAGES.SERVER_ERROR, "danger");
    return true;
  } else {
    if (res && res.data && res.data.token) {
      AsyncStorage.setItem('auth_token', res.data.token);
      axios.defaults.headers.common.Token = res.data.token;
    }
    return false;
  }
};

export const convertObjectToArray = valueArray => {
  const tempArray = [];
  valueArray.map(val => {
    tempArray.push(val.text);
  });
  return tempArray;
};

export const getFileExtension = filename => {
  return filename.split(".").pop();
};

export const stringToArray = str => {
  let convertedArray = [];
  if (typeof str != undefined && typeof str == "string") {
    const convertedStr = str.split(",");
    convertedArray = JSON.parse(convertedStr);
  }
  return convertedArray;
};

/**
 * @method timeConverterIntoUtcFormate
 * @description called to convert IST time into UTC time formate
 */
export const timeConverterIntoUtcFormate = time => {
  const currentTime = Moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const utcTime = Moment.utc(currentTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const timeObject = Moment(`${time}:00.000`, "HH:mm:ss.SSS");
  const currentUtcTime = Moment.utc(timeObject).format("HH:mm:ss.SSS");
  return {
    endTime: currentUtcTime,
    currentDateTime: utcTime
  };
};

/**
 * @method timeConverterIntoUtcFormate
 * @description called to convert local time into UTC time formate
 */
export const timeformate = time => {
  const currentTime = Moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const utcTime = Moment.utc(currentTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const userEndTime = Moment(`${time}`, "hh:mm A");
  return {
    endTime: userEndTime.toISOString(),
    currentDateTime: utcTime
  };
};

/**
 * @method imagePermissionModal
 * @description Ask user for permission for image upload
 */
export const imagePermissionModal = callback => {
  if (Platform.OS === "ios") {
    Permissions.checkMultiple(["camera", "photo"]).then(response => {
      if (response.photo == "authorized" && response.camera == "authorized") {
        callback();
      } else {
        //Toast.showToast('Permission to access your Camera or Photo is disabled. Please allow from application permission.', 'danger');
        Alert.alert(
          "Alert",
          MESSAGES.DEVICE_PERMISSION_CAMERA[
          { text: "Yes", onPress: () => Permissions.openSettings() }
          ],
          { cancelable: false }
        );
      }
    });
  } else {
    Permissions.checkMultiple(["camera", "storage"]).then(response => {
      if (response.camera != "authorized" || response.storage != "authorized") {
        PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          ],
          {
            title: "Alert",
            message: "We need your permission."
          }
        ).then(permRes => {
          if (
            permRes["android.permission.CAMERA"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            permRes["android.permission.READ_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            permRes["android.permission.WRITE_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED
          ) {
            callback();
          }
        });
      } else {
        callback();
      }
    });
  }
};

// /**
//  * @method locationPermissionModal
//  * @description Ask user for permission for location and get the users current location
//  */
// export const locationPermissionModal = callback => {
//   if (Platform.OS === 'ios') {
//     Permissions.request('location').then(response => {
//       if (response == 'authorized') {
//         navigator.geolocation.getCurrentPosition(
//           data => {
//             let myLat = data.coords.latitude;
//             let myLon = data.coords.longitude;
//             callback(data);
//           },
//           error => {
//             console.log(JSON.stringify(error));
//           },
//           { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
//         );
//       } else {
//         Alert.alert(
//           'Alert',
//           MESSAGES.DEVICE_PERMISSION_LOCATION,
//           [{ text: 'Yes', onPress: () => Permissions.openSettings() }],
//           { cancelable: false }
//         );
//       }
//     });
//   } else {
//     Permissions.request('location').then(response => {
//       if (response != 'authorized' || response == 'restricted') {
//         PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Alert',
//             message: 'We need your permission.'
//           }
//         ).then(permRes => {
//           if (
//             permRes['android.permission.ACCESS_FINE_LOCATION'] ===
//             PermissionsAndroid.RESULTS.GRANTED
//           ) {
//             navigator.geolocation.getCurrentPosition(
//               data => {
//                 let myLat = data.coords.latitude;
//                 let myLon = data.coords.longitude;
//                 callback(data);
//               },
//               error => {
//                 console.log(JSON.stringify(error));
//               },
//               { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
//             );
//           }
//         });
//       } else {
//         navigator.geolocation.getCurrentPosition(
//           data => {
//             let myLat = data.coords.latitude;
//             let myLon = data.coords.longitude;
//             callback(data);
//           },
//           error => {
//             console.log(JSON.stringify(error));
//           },
//           { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
//         );
//       }
//     });
//   }
// };

/**
 * @method Case for ping timer
 * @description called to ping api after interval on basis of user distance
 */
export const intervalTimer = distance => {
  if (distance < 20) {
    return 10000;
  } else if (distance > 20 && distance <= 250) {
    return 15000; //return 60000;
  } else if (distance > 250 && distance <= 500) {
    return 20000; //return 180000;
  } else if (distance > 500 && distance <= 1000) {
    return 30000; //return 300000;
  } else {
    return DEFAULT_PING_TIME;
  }
};

/**
 * @method locationPermissionModalOne
 * @description Ask user for permission for location and get the users current location
 */
export const locationPermissionModalOne = callback => {
  if (Platform.OS === "ios") {
    Permissions.request("location")
      .then(response => {
        if (response == "authorized") {
          Geolocation.getCurrentPosition(
            async data => {
              console.log("Geolocation ", data);
              callback(data);
            },
            error => {
              console.log(JSON.stringify(error));
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              showLocationDialog: true
            }
          );
        } else {
          callback(false);
          Alert.alert(
            "Alert",
            "Please go in app settings and allow your location permission for getting the result based on current location.",
            [{ text: "OK", onPress: () => Permissions.openSettings() }],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  } else {
    Geolocation.getCurrentPosition(
      async data => {
        console.log("Geolocation ", data);
        callback(data);
      },
      error => {
        console.log("Geolocation ", error);
        callback(false);
        Alert.alert(
          "Alert",
          "Please go in app settings and allow your location permission for getting the result based on current location.",
          [{ text: "OK", onPress: () => console.log(error) }],
          { cancelable: false }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        showLocationDialog: true
      }
    );
  }
};

export const getUrlFromString = (str) => {
  if (str && str != '' && str.includes('page:')) {
    let arrr = str.split('page: ');
    if (arrr && arrr[1] && validURL(arrr[1])) {
      let returnUrl = arrr[1];
      let prefix = 'http://';
      if (returnUrl.substr(0, prefix.length) !== prefix) {
        returnUrl = prefix + returnUrl;
      }
      return returnUrl;
    }
  }
  return '';
};

export const validURL = str => {
  let pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator

  return !!pattern.test(str);
};

/**
 * @method locationPermissionModalForAuth
 * @description Ask user for permission for location and get the users current location
 */
export const locationPermissionModalForAuth = callback => {
  if (Platform.OS === "ios") {
    Permissions.request("location")
      .then(response => {
        if (response == "authorized") {
          Geolocation.getCurrentPosition(
            async data => {
              console.log("Geolocation ", data);
              callback(data);
            },
            error => {
              console.log(JSON.stringify(error));
              callback(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
              showLocationDialog: false
            }
          );
        } else {
          callback(false);
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  } else {
    Geolocation.getCurrentPosition(
      async data => {
        console.log("Geolocation ", data);
        callback(data);
      },
      error => {
        console.log("Geolocation ", error);
        callback(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        showLocationDialog: false
      }
    );
  }
};

export { ValidationComponent };
