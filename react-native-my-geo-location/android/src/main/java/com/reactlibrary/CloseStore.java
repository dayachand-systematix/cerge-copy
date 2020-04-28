package com.reactlibrary;

import java.io.Serializable;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class CloseStore implements Serializable{

    @SerializedName("invitationId")
    @Expose
    private Integer invitationId;
    @SerializedName("retailStore")
    @Expose
    private RetailerStoreDTO retailStore;
    @SerializedName("distance")
    @Expose
    private Double distance;
    @SerializedName("invitationStatus")
    @Expose
    private String invitationStatus;
    @SerializedName("loyaltyNumber")
    @Expose
    private Object loyaltyNumber;

    public Integer getInvitationId() {
        return invitationId;
    }

    public void setInvitationId(Integer invitationId) {
        this.invitationId = invitationId;
    }

    public RetailerStoreDTO getRetailStore() {
        return retailStore;
    }

    public void setRetailStore(RetailerStoreDTO retailStore) {
        this.retailStore = retailStore;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public String getInvitationStatus() {
        return invitationStatus;
    }

    public void setInvitationStatus(String invitationStatus) {
        this.invitationStatus = invitationStatus;
    }

    public Object getLoyaltyNumber() {
        return loyaltyNumber;
    }

    public void setLoyaltyNumber(Object loyaltyNumber) {
        this.loyaltyNumber = loyaltyNumber;
    }

}