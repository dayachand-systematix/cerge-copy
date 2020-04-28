package com.cerge;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactlibrary.MyGeoLocationPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import cl.json.RNSharePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new MyGeoLocationPackage(),
            new GeolocationPackage(),
            new RNFusedLocationPackage(),
            new BackgroundTimerPackage(),
            new RNCWebViewPackage(),
            new RNSharePackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new RNScreensPackage(),
            new ReanimatedPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new NetInfoPackage(),
            new AsyncStoragePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
