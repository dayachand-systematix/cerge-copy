package com.reactlibrary;

import java.io.Serializable;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class RetailerDTO implements Serializable {

    @SerializedName("retailerId")
    @Expose
    private String retailerId;
    @SerializedName("businessName")
    @Expose
    private String businessName;
    @SerializedName("businessLogo")
    @Expose
    private String businessLogo;
    @SerializedName("industry")
    @Expose
    private String industry;

    public String getRetailerId() {
        return retailerId;
    }

    public void setRetailerId(String retailerId) {
        this.retailerId = retailerId;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getBusinessLogo() {
        return businessLogo;
    }

    public void setBusinessLogo(String businessLogo) {
        this.businessLogo = businessLogo;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }
}