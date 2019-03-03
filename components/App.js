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
import VoiceImage from "./voiceImage";
import CheckImages from "./checkImages";
import VoiceVideo from "./voiceVideo";
import VoiceAudio from "./voiceAudio";
import TellOption from "./tellOption";
import QuizResuts from "./quizResults";
import AllComments from "./comments";
import CommentReplies from "./commentReplies";
import ImageGrid from "./imageList";
import PlaySound from "./playSound";
import PlayVideo from "./playVideo";
import OnlyYtvVoice from "./onlyytvVoice";
import VoiceAnalytics from "./voiceAnalytics";

const store = createStore(reducer, applyMiddleware(thunk));

console.log("store....", store);

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
    },
    VoiceVideo: {
      screen: VoiceVideo
    },
    TellOption: {
      screen: TellOption
    },
    QuizResuts: {
      screen: QuizResuts
    },
    AllComments: {
      screen: AllComments
    },
    CommentReplies: {
      screen: CommentReplies
    },
    ImageGrid: {
      screen: ImageGrid
    },
    VoiceAudio: {
      screen: VoiceAudio
    },
    PlaySound: {
      screen: PlaySound
    },
    VoiceImage: {
      screen: VoiceImage
    },
    CheckImages: {
      screen: CheckImages
    },
    PlayVideo: {
      screen: PlayVideo
    },
    OnlyYtvVoice: {
      screen: OnlyYtvVoice
    },
    VoiceAnalytics: {
      screen: VoiceAnalytics
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
