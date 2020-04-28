package com.reactlibrary;

import java.io.Serializable;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Data implements Serializable{

    @SerializedName("closestStore")
    @Expose
    public CloseStore closestStore;
    @SerializedName("invitationRefreshSetting")
    @Expose
    public InvitationRefreshSetting invitationRefreshSetting;

    public CloseStore getClosestStore() {
        return closestStore;
    }

    public void setClosestStore(CloseStore closestStore) {
        this.closestStore = closestStore;
    }

    public InvitationRefreshSetting getInvitationRefreshSetting() {
        return invitationRefreshSetting;
    }

    public void setInvitationRefreshSetting(InvitationRefreshSetting invitationRefreshSetting) {
        this.invitationRefreshSetting = invitationRefreshSetting;
    }

}