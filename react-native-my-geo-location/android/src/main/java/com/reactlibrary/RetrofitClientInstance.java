package com.reactlibrary;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClientInstance {

    private static Retrofit retrofit;
    //private static final String BASE_URL = "https://cergeproductionapi.azurewebsites.net";
    private static final String BASE_URL = "https://cergedevapi.azurewebsites.net";
    //private static final String BASE_URL = "https://cergestageapi.azurewebsites.net";

    public Retrofit getRetrofitInstance() {
        if (retrofit == null) {
            retrofit = new retrofit2.Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}