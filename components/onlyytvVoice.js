import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Linking,
  AlertIOS
} from "react-native";

import Share, { ShareSheet, Button } from "react-native-share";
import Fa5 from "react-native-vector-icons/FontAwesome5";

import Icon from "react-native-vector-icons/Ionicons";

import { connect } from "react-redux";

import { Divider } from "react-native-elements";

class OnlyYtvVoice extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.setState(
      {
        articleId: this.props.navigation.getParam("articleId", ""),
        screenName: this.props.navigation.getParam("screenName", ""),
        parentCommentId: this.props.navigation.getParam("parentCommentId", "")
      },
      () => {
        console.log("I am in ONlyYTVVoice....", this.state);
      }
    );
  }

  onShare() {
    let shareOptions = {
      url: "https://www.youtube.com/watch?v=GeyDf4ooPdo",
      social: Share.Social.WHATSAPP
    };

    return Share.shareSingle(shareOptions);
  }

  onShare1() {
    let shareOptions = {
      title: "React Native",
      message: "Hola mundo",
      url: "http://facebook.github.io/react-native/",
      subject: "Share Link",
      social: Share.Social.EMAIL
    };

    return Share.shareSingle(shareOptions);
  }

  isPackageInstalled() {
    return Share.isPackageInstalled("com.xxx.xxx");
  }

  openUrl = url => () => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  openFUrl = url => () => {
    const FANPAGE_ID = url;
    const FANPAGE_URL_FOR_APP = `fb://page/jeevan.examwarrior/${FANPAGE_ID}`;
    const FANPAGE_URL_FOR_BROWSER = `https://fb.com/jeevan.examwarrior/${FANPAGE_ID}`;
    Linking.canOpenURL(FANPAGE_URL_FOR_APP)
      .then(supported => {
        if (!supported) {
          return Linking.openURL(FANPAGE_URL_FOR_BROWSER);
        } else {
          return Linking.openURL(FANPAGE_URL_FOR_APP);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  voiceImage = (articleId, screenName) => () => {
    if (!this.props.isAuthenticated) {
      this.props.navigation.navigate("YtvLogin", {
        screenName: "VoiceImage"
      });
    } else {
      this.props.navigation.navigate("VoiceImage", {
        articleId: this.state.articleId,
        screenName: this.state.screenName,
        parentCommentId: this.state.parentCommentId
      });
    }
  };

  voiceAudio = (articleId, screenName) => () => {
    if (!this.props.isAuthenticated) {
      this.props.navigation.navigate("YtvLogin", {
        screenName: "VoiceAudio"
      });
    } else {
      this.props.navigation.navigate("VoiceAudio", {
        articleId: articleId,
        screenName: screenName
      });
    }
  };

  voiceVideo = (articleId, screenName) => () => {
    if (!this.props.isAuthenticated) {
      this.props.navigation.navigate("YtvLogin", {
        screenName: "VoiceVideo"
      });
    } else {
      this.props.navigation.navigate("VoiceVideo", {
        articleId: this.state.articleId,
        screenName: this.state.screenName,
        parentCommentId: this.state.parentCommentId
      });
    }
  };

  allComments = () => {
    this.props.navigation.navigate("AllComments", {
      articleId: this.props.navigation.getParam("articleId", "")
    });
  };

  render() {
    const { navigation } = this.props;
    const articleId = navigation.getParam("articleId", "");
    const screenName = navigation.getParam("screenName", "");
    console.log("in ytv voivcsss", articleId);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#bf360c" />
        <ScrollView>
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{ flexDirection: "row", alignItems: "center", zIndex: 1 }}
            >
              <Icon name="ios-arrow-round-back" color="green" size={30} />
              <Text style={styles.logo}>Back...</Text>
            </TouchableOpacity>
          </View>

          <Image
            style={{
              height: 150,
              width: null,
              resizeMode: "contain",
              alignItems: "center",
              paddingTop: 50
            }}
            source={require("./resources/ytvheader.png")}
          />
          <View style={styles.card}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  //fontFamily: "Lobster-Regular",
                  color: "#1b5e20"
                }}
              >
                Add Your Voice on YTV Apps
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 20,
                paddingHorizontal: 20
              }}
            >
              <TouchableOpacity
                style={styles.bottomBarItem}
                onPress={this.voiceImage(articleId, screenName)}
              >
                <Fa5 name={"images"} size={40} color="#25D366" />
                <Text
                  style={{
                    paddingVertical: 5,
                    fontFamily: "Lobster-Regular",
                    color: "#bf360c"
                  }}
                >
                  {" "}
                  ImageVoice
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomBarItem}
                onPress={this.voiceAudio(articleId, screenName)}
              >
                <Fa5 name={"headphones"} size={40} color="#3b5998" />
                <Text
                  style={{
                    paddingVertical: 5,
                    fontFamily: "Lobster-Regular",
                    color: "#bf360c"
                  }}
                >
                  {" "}
                  AudioVoice
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomBarItem}
                onPress={this.voiceVideo(articleId, screenName)}
              >
                <Fa5 name={"video"} size={40} color="#38A1F3" />
                <Text
                  style={{
                    paddingVertical: 5,
                    fontFamily: "Lobster-Regular",
                    color: "#bf360c"
                  }}
                >
                  VideoVoice
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.isAuthenticated
  };
};

export default connect(
  mapStateToProps,
  null
)(OnlyYtvVoice);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  question: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold"
  },
  qoption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  label: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 48
  },
  card: {
    backgroundColor: "#ffffff",
    elevation: 3,
    marginVertical: 2
  },
  cardseparator: {
    borderBottomColor: "#d1d0d4",
    borderBottomWidth: 1
  },
  cardHeader: {
    fontSize: 18,
    padding: 5,
    color: "#bf360c",
    fontWeight: "bold"
  },
  cardImage: {
    width: null,
    height: 100
  },
  cardText: {
    fontSize: 14,
    padding: 5
  },
  headerBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#1b5e20",
    elevation: 3,
    paddingHorizontal: 15,

    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#9e9e9e",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 1,
    shadowOpacity: 1.0
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
    letterSpacing: 2
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  }
});
