import { combineReducers } from 'redux';
import auth from './Auth';
import profile from './Profile';
import invitations from './Invitations';
import common from './Common';
import shopping from './Shopping';
import retailers from './Retailers';
import review from './Review';

/** Combine all the reducers and export */
const rootReducer = combineReducers({
    auth,
    profile,
    invitations,
    shopping,
    retailers,
    common,
    review
});

export default rootReducer;
