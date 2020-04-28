package com.reactlibrary;

import java.io.Serializable;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class StoreDTO implements Serializable{

    @SerializedName("storeId")
    @Expose
    private String storeId;
    @SerializedName("storeInfo")
    @Expose
    private StoreInfoDTO storeInfo;

    public String getStoreId() {
        return storeId;
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }

    public StoreInfoDTO getStoreInfo() {
        return storeInfo;
    }

    public void setStoreInfo(StoreInfoDTO storeInfo) {
        this.storeInfo = storeInfo;
    }

}