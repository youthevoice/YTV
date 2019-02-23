import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import reducer from "./store/reducer";
import { createStackNavigator, createAppContainer } from "react-navigation";

import AllArticles from "./allArticles";
import DetailArticle from "./detailArticle";

import ChooseLang from "./chooseLang";
import YtvLogin from "./ytvLogin";
import PLogin from "./phLogin";
import GLogin from "./gfLogin";
import YtvShare from "./aShare";
import YtvVoice from "./addVoice";
import VoiceImage1 from "./voiceImage";
import CheckImages from "./checkImages";

const store = createStore(reducer, applyMiddleware(thunk));

console.log("store....", store);

const VoiceImage = createStackNavigator(
  {
    VoiceImage: {
      screen: VoiceImage1
    },
    CheckImages: {
      screen: CheckImages
    }
  },

  {
    headerMode: "none"
  },
  {
    initialRouteName: "VoiceImage1"
  }
);

const Articles = createStackNavigator(
  {
    AllArticles: {
      screen: AllArticles
    },
    DetailArticle: {
      screen: DetailArticle,
      path: "youthevoice.com/:articleId"
    },
    ChooseLang: {
      screen: ChooseLang
    },
    YtvLogin: {
      screen: YtvLogin
    },
    PLogin: {
      screen: PLogin
    },
    GLogin: {
      screen: GLogin
    },
    YtvShare: {
      screen: YtvShare
    },
    YtvVoice: {
      screen: YtvVoice
    },
    VoiceImage: {
      screen: VoiceImage
    }
  },
  {
    headerMode: "none"
  },
  {
    initialRouteName: "AllArticles"
  }
);
const prefix = "https://";

const AppContainer = createAppContainer(Articles);

const MainApp = () => <AppContainer uriPrefix={prefix} />;

export default class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <MainApp />
      </Provider>
    );
  }
}
