/**
* @method formatGetUserProfileResult 
* @description Used to format user profile deatils
*/

export function formatGetUserProfileResult(result) {
    let actObj = {
        roles: result.data.roles,
        _id: result.data._id,
        isActive: result.data.isActive,
        email: result.data.email,
        phone: result.data.phone,
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        profileImage: result.data.imageId,
        token: result.data.token
    };
    return actObj;
}

export function formatInvitationResponse(listItems) {
    let output = [];
    let storeData;
    if (listItems && listItems.length > 0) {
        listItems.forEach((item) => {
            storeData = item.retailStore.store;
            storeData.distance = item.distance;
            let existing = output.filter((v) => {
                return v.invitationId == item.invitationId;
            });
            if (existing.length) {
                const existingIndex = output.indexOf(existing[0]);
                output[existingIndex].retailStore.stores = output[existingIndex].retailStore.stores.concat(storeData);
            } else {
                item.retailStore.stores = [storeData];
                output.push(item);
            }
        });
    }
    return output;
}

export function formatGetShoppingHistoryResult(result, intialPageIndex) {
    const shoppingHistoryDataObj = {};
    const reviewList = [];
    if (reviewList && Array.isArray(reviewList)) {
        shoppingHistoryDataObj.reviewList = result.data;
        shoppingHistoryDataObj.pageIndex = intialPageIndex ? intialPageIndex + 1 : 1;
        shoppingHistoryDataObj.totalRecords = result.pageInfo ? result.pageInfo.totalCount : 0;
    }
    return shoppingHistoryDataObj;
}

export function formatSearchNearMeResult(data) {
    const formatSearchNearMeResult = [];
    if (data && Array.isArray(data.results)) {
        let requesData = {};
        data.results.map((item) => {
            requesData = {
                lat: item.geometry.location.lat,
                lng: item.geometry.location.lng,
                name: item.name,
                address: item.vicinity
            };
            formatSearchNearMeResult.push(requesData);
        });
    }
    return formatSearchNearMeResult;
}
