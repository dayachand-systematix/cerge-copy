import {
    REVIEW_API_REQUEST,
    REVIEW_API_FAILURE,
    REVIEW_HISTORY_LISTING,
    REVIEW_RATING,
    REQUESTDATA
} from '../constants';

/** Define initialState for reducer so that we don't get undefined values */
const initialState = {
    error: false,
    reviewLoading: false,
    reviewList: [],
    loadMoreReviews: false,
    initialrequestData: {
        pageSize: 10,
        pageIndex: 1
    },
    loadMoreRequestData: {
        pageSize: 10,
        pageIndex: 2
    },
    reviewsPageInfo: {},
    reviewListData: {
        reviewList: [],
        totalRecords: 0,
        pageIndex: 1
    }
};

/**
* @method authReducer
* @description Takes previous state and returns the new state
* @param {*} state 
* @param {*} action 
*/
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case REVIEW_API_REQUEST:
            return {
                ...state,
                reviewLoading: true,
            };
        case REVIEW_API_FAILURE:
            return {
                ...state,
                reviewLoading: false,
                loadMoreReviews: false,
                error: true
            };
        case REVIEW_HISTORY_LISTING:
            if (action.loadMore) {
                const List = {
                    reviewList: [...state.reviewListData.reviewList, ...action.payload.reviewList],
                    pageIndex: action.payload.pageIndex,
                    totalRecords: action.payload.totalRecords,
                };
                state.reviewListData = List;
            } else {
                state.reviewListData = action.payload;
            }
            return {
                ...state,
                error: '',
                reviewLoading: false,
            };
        case REVIEW_RATING:
            return {
                ...state,
                reviewLoading: false,
                reviewListData : {
                    ...state.reviewListData,
                    reviewList : state.reviewListData.reviewList.map((item, index)=> {
                        if(item.shoppingHistoryID == action.payload.shoppingHistoryID) {
                            item.star = action.payload.star;
                            return item;
                        }
                        return item;
                    })
                }
            }

        case REQUESTDATA:
            return {
                ...state,
                loadMoreRequestData,
                initialrequestData
            };
        default:
            return state;
    }
}
