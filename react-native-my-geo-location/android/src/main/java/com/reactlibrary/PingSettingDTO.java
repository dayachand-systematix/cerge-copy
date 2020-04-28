package com.reactlibrary;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class PingSettingDTO implements Serializable {

    @SerializedName("distance")
    @Expose
    private Double distance;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("refreshTime")
    @Expose
    private String refreshTime;

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRefreshTime() {
        return refreshTime;
    }

    public void setRefreshTime(String refreshTime) {
        this.refreshTime = refreshTime;
    }

}
