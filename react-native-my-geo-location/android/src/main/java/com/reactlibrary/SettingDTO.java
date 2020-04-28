package com.reactlibrary;

import java.io.Serializable;
import java.util.ArrayList;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class SettingDTO implements Serializable{
    @SerializedName("data")
    @Expose
    DataVal data;

    public DataVal getData() {
        return data;
    }

    public void setData(DataVal data) {
        this.data = data;
    }

    public class DataVal implements Serializable{
        @SerializedName("sysConfig")
        @Expose
        SysConfig sys_config;

        public SysConfig getSys_config() {
            return sys_config;
        }

        public void setSys_config(SysConfig sys_config) {
            this.sys_config = sys_config;
        }

        public class SysConfig implements Serializable{

            @SerializedName("ConfigSetting")
            @Expose
            ConfigSetting config_setting;

            public class ConfigSetting implements Serializable{
                @SerializedName("SearchRadius")
                @Expose
                private String search_radius = "";

                @SerializedName("PingSetting")
                @Expose
                private ArrayList<PingSettingDTO> pingSetting;

                public String getSearch_radius() {
                    return search_radius;
                }

                public void setSearch_radius(String search_radius) {
                    this.search_radius = search_radius;
                }

                public ArrayList<PingSettingDTO> getPingSetting() {
                    return pingSetting;
                }

                public void setPingSetting(ArrayList<PingSettingDTO> pingSetting) {
                    this.pingSetting = pingSetting;
                }
            }

            public ConfigSetting getConfig_setting() {
                return config_setting;
            }

            public void setConfig_setting(ConfigSetting config_setting) {
                this.config_setting = config_setting;
            }

        }

    }












}