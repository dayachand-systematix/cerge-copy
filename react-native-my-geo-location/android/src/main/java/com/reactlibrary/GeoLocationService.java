package com.reactlibrary;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.android.volley.toolbox.StringRequest;
import com.google.android.gms.location.DetectedActivity;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import io.nlopez.smartlocation.OnLocationUpdatedListener;
import io.nlopez.smartlocation.SmartLocation;
import io.nlopez.smartlocation.location.config.LocationAccuracy;
import io.nlopez.smartlocation.location.config.LocationParams;
import io.nlopez.smartlocation.location.providers.LocationBasedOnActivityProvider;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;


import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyError;
import com.android.volley.AuthFailureError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import java.util.HashMap;
import java.util.Map;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.content.SharedPreferences;


public class GeoLocationService extends Service {
    //public static final String FOREGROUND = "com.app_name.location.FOREGROUND";
    private static int GEOLOCATION_NOTIFICATION_ID = 12345689;
    LocationManager locationManager = null;
    private static Retrofit retrofit = null;
    String search_radius = "10000";
    double latitude = 0;
    double longitude = 0;
    double altitude = 0;
    String token = "";
    int pingStoreCountThroughCloseCount = 0;
    PingSettingDTO pingSettingDTO;
    double distance = 100;
    String storeId = "", historyStoreId = "", oldStoreId ="";
    Handler handler = new Handler();
    boolean inStoreStatus = false, outStoreStatus = false;
    int pingStoreCountThroughInStore = 0, pingStoreCountThroughOutStore = 0;
    //public String BASE_URL = "https://cergeproductionapi.azurewebsites.net/api/v1/";
    public String BASE_URL = "https://cergedevapi.azurewebsites.net/api/v1/";
    //public String BASE_URL = "https://cergestageapi.azurewebsites.net/api/v1/";
    SharedPreferences shpf;
    Runnable run1;

    LocationListener locationListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            Log.v("My Location", "==> "+location);
            latitude = location.getLatitude();
            longitude = location.getLongitude();
            altitude = location.getAltitude();
           // GeoLocationService.this.sendMessage(location);
        }

        @Override
        public void onStatusChanged(String s, int i, Bundle bundle) {}

        @Override
        public void onProviderEnabled(String s) {
            Log.v("My Provider", "==>"+s);
        }

        @Override
        public void onProviderDisabled(String s) {}
    };

    @Override
    @TargetApi(Build.VERSION_CODES.M)
    public void onCreate() {
        locationManager = getSystemService(LocationManager.class);


        int permissionCheck = ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION);
        Log.v("My Name", "GeoLocation");

        run1 = new Runnable() {
            @Override
            public void run() {
                getPingCloseStoreTask();
            }
        };
        if (permissionCheck == PackageManager.PERMISSION_GRANTED) {


            if(Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                startForeground(12345678, getNotification());
            }


            try {

                    LocationParams.Builder builder = new LocationParams.Builder();
                        builder.setInterval(3000);

                LocationParams.Builder builder1 = new LocationParams.Builder()
                        .setAccuracy(LocationAccuracy.HIGH)
                        .setDistance(0)
                        .setInterval(4000);
                Log.v("My Builder ", builder1+"=="+builder);


                SmartLocation.with(this).location().continuous().config(builder1.build()).start(new OnLocationUpdatedListener() {
                    @Override
                    public void onLocationUpdated(Location location) {
                        //Do what you need here.
                        Log.v("My New Location ", "==> " + location);
                        latitude = location.getLatitude();
                        longitude = location.getLongitude();
                        altitude = location.getAltitude();
                    }
                });



            }catch(Exception e){
                Log.v("My Local Exception ", "==>"+e);
            }





        }
    }


    @RequiresApi(api = Build.VERSION_CODES.O)
    private Notification getNotification() {

        NotificationChannel channel = new NotificationChannel("channel_01", "My Channel", NotificationManager.IMPORTANCE_DEFAULT);

        NotificationManager notificationManager = getSystemService(NotificationManager.class);
        notificationManager.createNotificationChannel(channel);

        Notification.Builder builder = new Notification.Builder(getApplicationContext(), "channel_01").setAutoCancel(true);
        return builder.build();
    }
    private void sendMessage(String location) {
        try {
            Intent intent = new Intent("GeoLocationUpdate");
            intent.putExtra("message", location);
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        locationManager.removeUpdates(locationListener);
        SmartLocation.with(this).location().stop();
        if(handler!=null){
            handler.removeCallbacksAndMessages(null);
        }
        super.onDestroy();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Bundle bun = intent.getExtras();
        token = bun.getString("token");
        shpf = getSharedPreferences("User_Data", MODE_PRIVATE);
        storeId = shpf.getString("storeId", "");
        oldStoreId = shpf.getString("oldStoreId", "");
        historyStoreId = shpf.getString("historyStoreId", "");
        if(storeId!=""){
            inStoreStatus = true;
            outStoreStatus = false;
        }
        pingStoreCountThroughOutStore = 0;
        pingStoreCountThroughInStore = 0;
        pingStoreCountThroughCloseCount = 0;
        callGetSettingTask();
        //startForeground(GEOLOCATION_NOTIFICATION_ID, getCompatNotification());
        return START_STICKY;
    }




    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    public void callGetSettingTask(){
        try {
            RequestQueue requestQueue = Volley.newRequestQueue(this);
            String URL = "http://...";
            JSONObject jsonBody = new JSONObject();
            final String requestBody = jsonBody.toString();

            StringRequest stringRequest = new StringRequest(Request.Method.GET, BASE_URL+"SysConfig/GetSysConfig", new com.android.volley.Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    try {
                        Gson gson = new Gson();
                        Log.v("My Response", "==>"+response);
                        JSONObject obj = new JSONObject(response);
                        SettingDTO dto = gson.fromJson(obj.toString(), SettingDTO.class);
                        if (dto != null) {
                            SettingDTO.DataVal dataVal = dto.getData();
                            if (dataVal != null) {
                                SettingDTO.DataVal.SysConfig sysConfig = dataVal.getSys_config();
                                if (sysConfig != null) {
                                    SettingDTO.DataVal.SysConfig.ConfigSetting cs = sysConfig.getConfig_setting();
                                    search_radius = cs.getSearch_radius();
                                    ArrayList<PingSettingDTO> pingSettingList = cs.getPingSetting();
                                    if (pingSettingList != null) {
                                        for (int i = 0; i < pingSettingList.size(); i++) {
                                            String status = pingSettingList.get(i).getStatus();
                                            if (status.equalsIgnoreCase("In-store")) {
                                                pingSettingDTO = pingSettingList.get(i);
                                                break;
                                            }
                                        }
                                    }
                                    setHandler(10000);

                                }
                            }
                        }
                    }catch(Exception e){
                        setHandler(10000);
                    }
                }
            }, new com.android.volley.Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.e("VOLLEY", error.toString());
                }
            }) {
                @Override
                public String getBodyContentType() {
                    return "application/json; charset=utf-8";
                }

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String> parm = new HashMap<>();
                    parm.put("Token", ""+token);
                    return parm;
                }

                @Override
                public byte[] getBody() throws AuthFailureError {
                    try {
                        return requestBody == null ? null : requestBody.getBytes("utf-8");
                    } catch (UnsupportedEncodingException uee) {
                        //VolleyLog.wtf("Unsupported Encoding while trying to get the bytes of %s using %s", requestBody, "utf-8");
                        return null;
                    }
                }


            };

            requestQueue.add(stringRequest);
        } catch (Exception e) {
            Log.v("My Response Exception ", "==>"+e);
            e.printStackTrace();
        }
    }




    public void callInStoreTask(){
        JSONObject obj = new JSONObject();
        try{
            obj.put("storeId", storeId);
        }
        catch(Exception e){
            Log.v("Response Ping", "==>"); //added by dc
        }

        JsonObjectRequest jor = new JsonObjectRequest(Request.Method.POST, BASE_URL+"Shopper/EnterStore", obj,
                new com.android.volley.Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                        try{
                            Log.v("Response InStore ", "==>"+response);
                            inStoreStatus = true;
                            oldStoreId = storeId;
                            historyStoreId = response.getString("data");
                            setHandler(60000);

                            SharedPreferences.Editor edt = shpf.edit();
                            edt.putString("storeId", ""+storeId);
                            edt.putString("oldStoreId", ""+oldStoreId);
                            edt.putString("historyStoreId", ""+historyStoreId);
                            edt.commit();


                        }catch(Exception e){
                            e.printStackTrace();
                            setHandler(10000); //added by dc
                        }
                        GeoLocationService.this.sendMessage(""+response.toString());
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
                Map<String, String> params = new HashMap<String, String>();
                params.put("Token", token);
                return params;
            }
        };

        Volley.newRequestQueue(getApplicationContext()).add(jor);
        //requestQueue.add(jor);
    }

    public void callLeaveStoreTask(String storeId1){
        JSONObject obj = new JSONObject();
        try{
            obj.put("storeId", storeId1);
            obj.put("shoppingHistoryId", historyStoreId);
        }
        catch(Exception e){
            Log.v("Response Ping", "==>"); //added by dc
        }

        JsonObjectRequest jor = new JsonObjectRequest(Request.Method.POST, BASE_URL+"Shopper/LeaveStore", obj,
                new com.android.volley.Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.v("Response Outer", "==> "+response.toString());
                        try{
                            outStoreStatus = true;
                            inStoreStatus = false;
                            storeId = "";
                            oldStoreId = "";
                            historyStoreId = "";
                            setHandler(10000);
                            pingStoreCountThroughCloseCount = 0;
                            SharedPreferences.Editor edt = shpf.edit();
                            edt.putString("storeId", "");
                            edt.putString("oldStoreId", "");
                            edt.putString("historyStoreId", "");
                            edt.commit();



                        }catch(Exception e){
                            Log.v("My Exception", "==> "+e);
                            setHandler(10000); //added by dc
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
                Map<String, String> params = new HashMap<String, String>();
                params.put("Token", token);
                return params;
            }
        };

        Volley.newRequestQueue(getApplicationContext()).add(jor);
        //requestQueue.add(jor);
    }








    public void getPingCloseStoreTask(){
        RequestQueue requestQueue;
        JSONObject fullObject = new JSONObject();
        try {
            fullObject.put("radius", ""+search_radius);
            JSONObject obj = new JSONObject();
            obj.put("latitude", ""+latitude);
            obj.put("longitude", ""+longitude);
            obj.put("altitude", ""+altitude);
            fullObject.put("location", obj);

        } catch (Exception e){
            Log.v("Response Ping", "==>"); //added by dc
        }
        Log.v("My Request", "==>"+fullObject.toString());
        JsonObjectRequest jor = new JsonObjectRequest(Request.Method.POST, BASE_URL+"Shopper/PingClosestStore", fullObject,
                new com.android.volley.Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {

                        try{
                            Log.v("Response Ping", "==>"+response);
                            setLogic(response.toString());

                        }catch(Exception e){
                            Log.v("My Exception", "==> "+e);
                            setHandler(60000); //added by dc
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
                Map<String, String> params = new HashMap<String, String>();
                params.put("Token", token);
                return params;
            }
        };

        Volley.newRequestQueue(getApplicationContext()).add(jor);
        //requestQueue.add(jor);
    }

    public void setLogic(String reponse){
        Gson gson = new Gson();
        PingCloseStoreDTO dto = gson.fromJson(reponse, PingCloseStoreDTO.class);
        if(dto!=null){

            Data data = dto.getData();
            if(data!=null){
                CloseStore closeStore = data.getClosestStore();
                if(closeStore!=null){
                    RetailerStoreDTO retailerStoreDTO = closeStore.getRetailStore();
                    if(retailerStoreDTO!=null){
                        StoreDTO storeDTO = retailerStoreDTO.getStore();
                        if(storeDTO!=null){
                            storeId = storeDTO.getStoreId();
                            double closeStoreDist = closeStore.getDistance();
                            if(!inStoreStatus){
                                if(storeId!=null && (storeId.equalsIgnoreCase(oldStoreId) || oldStoreId=="") && closeStoreDist < distance) {
                                    //oldStoreId = storeId;
                                    if(pingStoreCountThroughInStore<2) {
                                        pingStoreCountThroughInStore++;
                                        setHandler(10000);
                                    }
                                    else{
                                        pingStoreCountThroughInStore = 0;
                                        callInStoreTask();
                                    }
                                }
                                else{
                                    InvitationRefreshSetting settingDTO = data.getInvitationRefreshSetting();
                                    if(settingDTO!=null){
                                        int refreshTime = settingDTO.getNextRefreshTime();
                                        if(refreshTime == 0){
                                            setHandler(60000);
                                        }
                                        else{
                                            setHandler(refreshTime*1000);
                                        }
                                    }
                                    else{
                                        setHandler(60000);
                                    }
                                }
                            }
                            else{
                                if(!storeId.equalsIgnoreCase(oldStoreId)){
                                    if(closeStoreDist < distance){
                                        if(pingStoreCountThroughOutStore<2) {
                                            pingStoreCountThroughOutStore++;
                                            setHandler(10000);
                                        }
                                        else{
                                            pingStoreCountThroughOutStore = 0;
                                            callLeaveStoreTask(oldStoreId);
                                        }

                                    }
                                    else{
                                        InvitationRefreshSetting settingDTO = data.getInvitationRefreshSetting();
                                        if(settingDTO!=null){
                                            int refreshTime = settingDTO.getNextRefreshTime();
                                            if(refreshTime == 0){
                                                setHandler(60000);
                                            }
                                            else{
                                                setHandler(refreshTime*1000);
                                            }
                                        }
                                        else{
                                            setHandler(60000);
                                        }
                                    }


                                }
                                else{
                                    pingStoreCountThroughOutStore = 0;
                                    setHandler(60000);
                                }
                            }




                        }
                        else{
                            setHandler(60000);
                        }
                    }
                    else{
                        setHandler(60000);
                    }
                }
                else{
                    pingStoreCountThroughInStore = 0;
                    if(!inStoreStatus) {
                        InvitationRefreshSetting settingDTO = data.getInvitationRefreshSetting();
                        if (settingDTO != null) {
                            int refreshTime = settingDTO.getNextRefreshTime();
                            if (refreshTime == 0) {
                                setHandler(60000);
                            } else {
                                setHandler(refreshTime * 1000);
                            }
                        } else {
                            setHandler(60000);
                        }
                    }
                    else{
                        if(pingStoreCountThroughCloseCount<2) {
                            pingStoreCountThroughCloseCount++;
                            setHandler(10000);
                        }
                        else{
                            pingStoreCountThroughCloseCount = 0;
                            callLeaveStoreTask(storeId);
                        }
                    }
                }
            }
            else{
                setHandler(60000);
            }
        }

    }

    public void setHandler(long ms){
        handler.removeCallbacksAndMessages(null);
        handler.removeCallbacks(run1);
        handler.postDelayed(run1, ms);



    }

}
