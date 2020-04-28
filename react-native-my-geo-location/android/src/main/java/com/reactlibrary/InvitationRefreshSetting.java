package com.reactlibrary;

import java.io.Serializable;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class InvitationRefreshSetting implements Serializable{

    @SerializedName("refreshStatus")
    @Expose
    private String refreshStatus;
    @SerializedName("nextRefreshTime")
    @Expose
    private Integer nextRefreshTime;

    public String getRefreshStatus() {
        return refreshStatus;
    }

    public void setRefreshStatus(String refreshStatus) {
        this.refreshStatus = refreshStatus;
    }

    public Integer getNextRefreshTime() {
        return nextRefreshTime;
    }

    public void setNextRefreshTime(Integer nextRefreshTime) {
        this.nextRefreshTime = nextRefreshTime;
    }

}