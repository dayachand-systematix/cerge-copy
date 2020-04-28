package com.reactlibrary;

import java.io.Serializable;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class RetailerStoreDTO implements Serializable{

    @SerializedName("retailer")
    @Expose
    private RetailerDTO retailer;
    @SerializedName("store")
    @Expose
    private StoreDTO store;

    public RetailerDTO getRetailer() {
        return retailer;
    }

    public void setRetailer(RetailerDTO retailer) {
        this.retailer = retailer;
    }

    public StoreDTO getStore() {
        return store;
    }

    public void setStore(StoreDTO store) {
        this.store = store;
    }

}