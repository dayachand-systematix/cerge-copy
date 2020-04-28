package com.reactlibrary;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.os.Handler;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import android.content.SharedPreferences;

import com.android.volley.Request;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MyGeoLocationModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext = null;
    SharedPreferences shpf;
    //public String BASE_URL = "https://cergeproductionapi.azurewebsites.net/api/v1/";
    public String BASE_URL = "https://cergedevapi.azurewebsites.net/api/v1/";
    //public String BASE_URL = "https://cergestageapi.azurewebsites.net/api/v1/";
    Handler handler;

    public MyGeoLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        BroadcastReceiver geoLocationReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String message = intent.getStringExtra("message");
                MyGeoLocationModule.this.sendEvent(message);
            }
        };
        LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(geoLocationReceiver, new IntentFilter("GeoLocationUpdate"));
    }

    @Override
    public String getName() {
        Log.v("My Data.java", "Da");
        //newData();
        return "GeoLocation";
    }



    @ReactMethod
    public void startService(String s1) {
        String result = "Success";
        Log.v("My Location", s1+"==> "+result);

        try {
            Intent intent = new Intent(this.getReactApplicationContext(), GeoLocationService.class);
            //intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
            intent.putExtra("token", ""+s1);
            getReactApplicationContext().startService(intent);
        } catch (Exception e) {
            Log.v("My Exception", "==>"+e);
            //promise.reject(e);
            return;
        }
        //promise.resolve(result);
    }

    @ReactMethod
    public void restartService(final String token){
        Log.v("My Call", "Restart Servcie");
        try {
            Intent intent = new Intent(this.getReactApplicationContext(), GeoLocationService.class);
            //intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
            this.getReactApplicationContext().stopService(intent);
        } catch (Exception e) {
            //promise.reject(e);
            Log.v("My Exception ", "==>"+e);
            return;
        }
        handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                startService(token);
            }
        }, 1000);


    }



    @ReactMethod
    public void stopService() {
        String result = "Success";
        Log.v("My Stop ", "Stop Service");
        try {
            Intent intent = new Intent(this.getReactApplicationContext(), GeoLocationService.class);
            //intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
            this.getReactApplicationContext().stopService(intent);
        } catch (Exception e) {
            //promise.reject(e);
            return;
        }
        //promise.resolve(result);
    }

        @ReactMethod
        public void checkInStore(String token){
            Log.v("My Call", "Check in Store");
            SharedPreferences shpf = this.getReactApplicationContext().getSharedPreferences("User_Data", Context.MODE_PRIVATE);
            String storeId = shpf.getString("storeId", "");
            String oldStoreId = shpf.getString("oldStoreId", "");
            String historyStoreId = shpf.getString("historyStoreId", "");
            if(storeId!=""){
                callLeaveStoreTask(storeId, historyStoreId, token);
            }
            else{
                stopService();
            }
        }



        public void callLeaveStoreTask(String storeId, String historyStoreId, final String token){
            JSONObject obj = new JSONObject();
            try{
                obj.put("storeId", storeId);
                obj.put("shoppingHistoryId", historyStoreId);
            }
            catch(Exception e){

            }

            JsonObjectRequest jor = new JsonObjectRequest(Request.Method.POST, BASE_URL+"Shopper/LeaveStore", obj,
                    new com.android.volley.Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("My Leave Response ", "==>"+response.toString());
                            try{
                                SharedPreferences shpf = getReactApplicationContext().getSharedPreferences("User_Data", Context.MODE_PRIVATE);
                                SharedPreferences.Editor edt = shpf.edit();
                                edt.putString("storeId", "");
                                edt.putString("oldStoreId", "");
                                edt.putString("historyStoreId", "");
                                edt.commit();
                                stopService();



                            }catch(Exception e){
                                Log.v("My Exception", "==> "+e);
                                e.printStackTrace();
                            }
                        }

                    },
                    new com.android.volley.Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.v("My Volley","Error"+error);

                        }
                    }
            ) {    //this is the part, that adds the header to the request
                @Override
                public Map<String, String> getHeaders() {
                    Map<String, String> params = new HashMap<>();
                    params.put("Token", token);
                    return params;
                }
            };

            Volley.newRequestQueue(getReactApplicationContext()).add(jor);
            //requestQueue.add(jor);
        }



    private void sendEvent(String message) {
        WritableMap map = Arguments.createMap();
        WritableMap coordMap = Arguments.createMap();

        map.putString("timestamp", message+"");

        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onSessionConnect", map);
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }
}
