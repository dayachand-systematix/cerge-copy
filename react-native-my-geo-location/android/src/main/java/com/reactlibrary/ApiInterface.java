package com.reactlibrary;

import org.json.JSONObject;

import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Field;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface ApiInterface {


    @GET("api/v1/SysConfig/GetSysConfig")
    Call<SettingDTO> getSetting(@Header("Authorization") String header);


    @Headers({
            "Accept: application/json",
            "Content-Type: application/json"
    })
    @POST("api/v1/Shopper/PingClosestStore")
    Call<PingCloseStoreDTO> getPingCloseStore(@Header("Authorization") String token, @Header("Token") String header, @Body JSONObject body);


    @POST("api/v1/Shopper/PingClosestStore")
    Call<NewData> getPingCloseStore1(@Header("Authorization") String token, @Header("Token") String header, @Body JSONObject body);

    @Headers("Content-Type: application/json; charset=utf-8")
    @POST("api/v1/Shopper/EnterStore")
    Call<SettingDTO> postInStore(@Header("Authorization") String token, @Body JSONObject body);

    @POST("api/v1/Shopper/LeaveStore")
    Call<SettingDTO> postOutStore(@Header("Authorization") String token, @Body JSONObject body);
}
