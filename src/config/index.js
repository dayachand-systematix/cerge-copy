/**
 * Inside this file we define all the necessary configurations
 * Like the base url and endpoints, file configuration, etc
 * Export the required settings and import them wherever required
 */
import AXIOS from "axios";
import { MAX_TIMEOUT } from "../constants";

const cancelToken = AXIOS.CancelToken;
const source = cancelToken.source();
export const axios = AXIOS.create({
  timeout: MAX_TIMEOUT,
  cancelToken: source.token
});

export const API_VERSION_TEST = "ver0.0.2";

//export const BASE_URL = 'https://cergestageapi.azurewebsites.net'; //stagging
export const BASE_URL = "https://cergedevapi.azurewebsites.net"; //new Base for dev
//export const BASE_URL = "https://cergeproductionapi.azurewebsites.net"; //new Base for dev

export const API_VERSION = "1";
export const PROFILE_MEDIA_URL = `${BASE_URL}/api/account/settings/media/`;

//GOOGLE API KEY
export const GOOGLE_API_KEY = "AIzaSyB3AOxAfhPn0k1iRyXlqu_YrE8B6Y5cJgg";

export const PROFILE_FILE_SIZE = "1500000";
export const DEFAULT_PING_TIME = 120000; //900000; //15000; //900000;
export const DEFAULT_RADIUS = 100000; //1000;
export const DATE_FORMAT = "DD/MM/YYYY";
export const TIME_FORMAT = "hh:mm A";
export const EMAIL_TO = "info@cerge.app";
export const EMAIL_SUBJECT = "Report%20bug%20or%20issue%20to%20improve%20the%20Cérge%20App";
export const PRIVACY_TITLE = "Privacy Policy";
export const PRIVACY_LINK = "https://www.cerge.app/privacy";
export const TERMS_TITLE = "Terms of Service";
export const TERMS_LINK = "https://www.cerge.app/tcmember";



/** Export API */
export const API = {
  login: `${BASE_URL}/auth/login`,
  logout: `${BASE_URL}/auth/logout`,
  forgotPassword: `${BASE_URL}/auth/forgotpassword`,
  updatePassword: `${BASE_URL}/auth/updatepassword/`,
  updateUserProfile: `${BASE_URL}/users/update/`,
  getAssetsDetailAPI: `${BASE_URL}/assets`,
  getSingleAssetsAPI: `${BASE_URL}/assets`,
  getUserDetails: `${BASE_URL}/users`,

  GetNewInvitationList: `${BASE_URL}/api/v${API_VERSION}/Shopper/GetNewInvitationList`,
  PingClosestStore: `${BASE_URL}/api/v${API_VERSION}/Shopper/PingClosestStore`,
  GetInvitationDetail: `${BASE_URL}/api/v${API_VERSION}/Shopper/GetInvitationDetail`,
  GetAcceptedInvitation: `${BASE_URL}/api/v${API_VERSION}/Shopper/GetAcceptedInvitation`,
  GetRemovedInvitation: `${BASE_URL}/api/v${API_VERSION}/Shopper/GetRemovedInvitation`,
  AcceptInvitation: `${BASE_URL}/api/v${API_VERSION}/Shopper/AcceptInvitation`,
  RejectInvitation: `${BASE_URL}/api/v${API_VERSION}/Shopper/RejectInvitation`,
  GetUserProfile: `${BASE_URL}/api/v${API_VERSION}/Shopper/GetUserProfile`,
  UpdateUserBasicInfo: `${BASE_URL}/api/v${API_VERSION}/Shopper/UpdateUserBasicInfo`,
  UpdateUserShoppingStatus: `${BASE_URL}/api/v${API_VERSION}/Shopper/UpdateUserShoppingStatus`,
  EnterStore: `${BASE_URL}/api/v${API_VERSION}/Shopper/EnterStore`,
  LeaveStore: `${BASE_URL}/api/v${API_VERSION}/Shopper/LeaveStore`,
  GetShoppingHistory: `${BASE_URL}/api/v${API_VERSION}/Shopper/GetShoppingHistory`,
  SetShoppingRating: `${BASE_URL}/api/v${API_VERSION}/Shopper/SetShoppingRating`,
  hatSignupAPI: `${BASE_URL}/api/v${API_VERSION}/Account/ShopperSignup`,
  hatLoginAPI: `${BASE_URL}/api/v${API_VERSION}/Account/ShopperLogin`,
  hatLoginCallback: `${BASE_URL}/api/v${API_VERSION}/Account/HatLoginCallBack`,
  pingClosestStore: `${BASE_URL}/api/v${API_VERSION}/Shopper/PingClosestStore`,
  enterStore: `${BASE_URL}/api/v${API_VERSION}/Shopper/EnterStore`,
  leaveStore: `${BASE_URL}/api/v${API_VERSION}/Shopper/LeaveStore`,
  updateLoyaltyNumber: `${BASE_URL}/api/v${API_VERSION}/Shopper/UpdateLoyaltyNumber`,

  GetPreferenceConfig: `${BASE_URL}/api/v${API_VERSION}/SysConfig/GetPreferenceConfig`,
  DownloadImage: `${BASE_URL}/api/v${API_VERSION}/File/DownloadImage`,
  GetSysConfig: `${BASE_URL}/api/v${API_VERSION}/SysConfig/GetSysConfig`
};

/** Export FILE_CONFIG */
export const FILE_CONFIG = {
  MAX_NUMBER_OF_FILES: 5,
  MAX_FILE_SIZE: 1024 /** In KBs */
};

export const MAX_VIDEO_SIZE = 20000000;
export const AMP_CONTROL_ROLE = "5bcd627cc1a43f14cd408b34";
export const COUNCIL_ADMIN_ROLE = "5c3e8cf51fcd14c699906f18";

export const MESSAGES = {
  LOGIN_SUCCESS: "You are successfully logged in.",
  SOME_ERROR: "There went wrong. Please try again later.",
  PROFILE_UPDATE_SUCESS: "Your profile has been updated successfully.",
  MAX_UPLOAD_IMAGE_SIZE:
    " Please upload only image files with size equal to or less than 15MB.",
  INVALID_EMAIL: "It seems, the email address is invalid.",
  RESEND_VARIFICATION_CODE_FAIL:
    "Oops! something went wrong in resending verification token on your registered email address.",
  LOGOUT_SUCCESS: "You are successfully logged out.",
  USER_PROFILE_IMAGE_UPLOAD_SUCCESS:
    "Your profile image has been uploaded successfully.",
  FIELD_ERROR_MESSAGE:
    "Please check and correct the errors for submitting the form.",
  OLD_PASSWORD_ERROR: "Please enter valid old password.",
  RESET_PASSWORD:
    "The reset password instructions have been sent on your relevant  email address.",
  IMAGE_FILE_SIZE:
    "Please upload only image files with size equal to or less than 200KB.",
  INVITATION_REJECT_SUCCESS: "Invitation rejected successfully.",
  INVITATION_ACCEPT_SUCCESS: "New invitation accepted successfully.",
  RETAILER_ACCEPT_SUCCESS: "Retailer accepted successfully.",
  RATING_SUCCESS: "Your rating has been submitted successfully.",
  SHOPPING_TIMERANGE_ERROR: "Mission time-range is not valid.",
  SHOPPING_DATE_ERROR: "Mission date is not valid.",
  SHOPPING_STATUS_SUCCESS:
    "Your status has been updated successfully.",
  USER_NOT_REGESTERED: "You are not registered, click next to register.",
  USER_REGESTERED: "You are registered with us, click next to login.",
  LOGGED_IN_SUCCESS: "You are successfully logged in.",
  UNAUTHORIZED_USER: "You are unauthorized user, please login again.",
  SESSION_EXPIRED: "Your session has been expired. Please login again.",
  SERVER_ERROR: "Server error occurred, please try again after sometime.",
  POOR_CONNECTION: "Poor internet connection. Try later!",
  DEVICE_PERMISSION_CAMERA:
    "We need device permissions for accessing the photo and gallery.",
  DEVICE_PERMISSION_LOCATION:
    "We need device permissions for accessing the location.",
  RATING_VALIDATION: "Please provide appropriate rating.",
  LOYALTY_UPDATE_SUCCESS: "Loyalty updated successfully.",
  REQUIRED_MESSAGE: "This field is required.",
  INCORRECT_URL: "This URL is invalid",
  DOB: 'Minimum age should be above 15 years.',
};

//All status code for API response
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  GONE: 410,
  PRECONDITION_FAILED: 412,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  VALIDATION: 100,
  BAD_GATEWAY: 502,
  NOT_IMPLIMENTED: 501
};
