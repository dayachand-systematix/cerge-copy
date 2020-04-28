import {
	AUTH_API_REQUEST,
	AUTH_API_FAILURE,
	LOGIN_SUCCESS,
	UPDATE_PASSWORD_SUCCESS,
	FORGOT_PASSWORD_SUCCESS,
	FETCH_USER_DATA,
	LOGOUT_SUCCESS,
	AUTH_LOGOUT_API_REQUEST,
	UPDATE_INTRO_STATUS
} from '../constants';

/** Define initialState for reducer so that we don't get undefined values */
const initialState = {
	error: false,
	isIntroShowed: 'false',
	loading: false,
	email: '',
	password: '',
	userData: {},
};

/**
* @method authReducer
* @description Takes previous state and returns the new state
* @param {*} state 
* @param {*} action 
*/
export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case AUTH_API_REQUEST:
			return {
				...state,
				loading: true
			};
		case AUTH_LOGOUT_API_REQUEST:
			return {
				...state,
				loading: false
			};
		case AUTH_API_FAILURE:
			return {
				...state,
				loading: false,
				error: true
			};
		case LOGIN_SUCCESS:
			return {
				...state,
				userData: action.payload,
				error: false,
				loading: false
			};
		case UPDATE_PASSWORD_SUCCESS:
			return {
				...state,
				error: false,
				loading: false
			};
		case FORGOT_PASSWORD_SUCCESS:
			return {
				...state,
				loading: false
			};
		case FETCH_USER_DATA:
			return {
				...state,
				loading: false,
				userData: {
					...state.userData,
					...action.payload
				}
			};
		case LOGOUT_SUCCESS:
			return {
				...state,
				loading: false
			};
		case UPDATE_INTRO_STATUS:
			return {
				...state,
				isIntroShowed: action.payload,
			};
		default:
			return state;
	}
}
