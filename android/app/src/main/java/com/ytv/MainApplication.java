package com.ytv;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.rnfs.RNFSPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.amarcruz.photoview.PhotoViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication,   ShareApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
            new RNGoogleSigninPackage(),
            new RNFirebasePackage(),
            new RNGestureHandlerPackage(),
              new SplashScreenReactPackage(),
        new RNFirebaseMessagingPackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseNotificationsPackage(),
              new SnackbarPackage(),
      new RNSharePackage(),
              new RNFSPackage(),
              new RNFetchBlobPackage(),
              new PhotoViewPackage(),
              new ReactVideoPackage(),
              new RNSoundPackage(),
              new ReactNativeAudioPackage(),
              new OrientationPackage(),
              new LinearGradientPackage(),
              new RNUUIDGeneratorPackage()

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

    @Override
    public String getFileProviderAuthority() {
        return "com.ytvt1.fileprovider";
    }

}
