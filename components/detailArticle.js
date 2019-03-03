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
  AlertIOS,
  AsyncStorage,
  Dimensions
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import HTML from "react-native-render-html";
import Fa5 from "react-native-vector-icons/FontAwesome5";

import axios from "axios";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import Loader from "./loader";

import { connect } from "react-redux";

class DetailArticle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      qresults1: false,
      selopt: null,
      shareModal: false,

      isLoggedIn: false,
      // isAuthenticated: false,
      upVote: false,
      dwVote: false,
      upVoteColor: "#9e9e9e",
      dwVoteColor: "#9e9e9e",
      loadL: false,
      articleData: {},
      renderI: false,

      upVoteTrueColor: "#42a5f5",
      upVoteFalseColor: "#9e9e9e",

      dwVoteTrueColor: "#424242",
      dwVoteFalseColor: "#9e9e9e"
    };
  }

  async componentDidMount() {
    this.setState({
      articleId: this.props.navigation.getParam("articleId", "")
    });
    this._getUserArticleLike();
  }

  _getUserArticleLike = () => {
    // this.setState({ loadL: true });
    console.log("I am in compo");

    axios.all([this._getArticle(), this._getUserLike()]).then(
      axios.spread((articles, likes) => {
        console.log("likessssss", articles.data);

        this.setState({
          loadL: false,
          articleData: articles.data,
          renderI: true,
          dwVote: likes.data.dwVote,
          upVote: likes.data.upVote
        });
      })
    );
  };

  _getArticle = () => {
    /* 1. Navigate to the Details route with params */

    // this.setState({ loadL: true });

    return axios.get("https://youthevoice.com/getarticles", {
      params: {
        articleId: this.props.navigation.getParam("articleId", "")
      }
    });
  };

  _getUserLike = () => {
    return axios.get("https://youthevoice.com/getuserlike", {
      params: {
        articleId: this.props.navigation.getParam("articleId", ""),
        userId: this.props.userId
      }
    });
  };

  _keyExtractor = (item, index) => item.id;

  Separator = () => <View style={styles.separator} />;

  openUrl = url => () => {
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

  openYUrl = url => () => {
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

  pVideo = () => {
    this.props.navigation.navigate("PlayVideo", {
      playUrl: "https://youthevoice.com/v1.mp4"
    });
  };

  commentVideo = () => {
    this.props.navigation.navigate("PickFile");
  };

  recordVideo = () => {
    this.props.navigation.navigate("CameraScreen");
  };

  getArticle = async articleId => {
    this.setState({ loading: true });

    axios
      .get("https://youthevoice.com/getarticles", {
        params: {
          articleId: articleId
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          detailData: res.data,
          loading: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  quizState = (_quizId, optionId) => () => {
    _quizVoted = _quizId + "Voted";
    console.log(_quizId, optionId);
    this.setState({ ...this.state, [_quizId]: optionId });
    console.log("stateis isisis", this.state);
  };

  createQuiz = (data, quizId, optionId) => {
    _quizId = "quiz" + quizId;
    // console.log("datttttt Detail", data);
    return (
      <TouchableOpacity
        style={styles.qoption}
        onPress={this.quizState(_quizId, optionId)}
      >
        <Icon
          name={
            this.state[_quizId] == optionId
              ? "ios-radio-button-on"
              : "ios-radio-button-off"
          }
          color={this.state[_quizId] == optionId ? "#4CAF50" : "#757575"}
          size={16}
          style={{ paddingRight: 10 }}
        />

        <Text
          style={{
            fontSize: 16
          }}
        >
          {data.option}
        </Text>
      </TouchableOpacity>
    );
  };
  onQuizCancel = quizId => () => {
    console.log("I am in cancel");
    quizVoted = "quiz" + quizId + "Voted";
    _quizId = "quiz" + quizId;

    this.setState({ [_quizId]: null }, () => {
      console.log("stateis isisis", this.state);
      this.postQuiz(quizId, "C")();
    });
  };

  postQuiz = (quizId, status, aquizId) => () => {
    quizVoted = "quiz" + quizId + "Voted";
    _quizId = "quiz" + quizId;

    // console.log("quizVoted", quizVoted);

    if (status == "A") {
      this.setState({
        ...this.state,
        [quizVoted]: true
      });
    }

    axios
      .post("https://youthevoice.com/postquizanswer", {
        params: {
          // userId: this.props.userId,
          userId: this.props.userId,
          articleId: this.state.articleId,
          quizId: quizId,
          optionId: this.state[_quizId],
          status: status
        }
      })
      .then(res => {
        // console.log("quiz postedddd", res.data);
        this.setState({ [quizVoted]: res.data.voted }, () => {
          res.data.voted
            ? this.props.navigation.navigate("QuizResuts", {
                articleId: this.state.articleID,
                quizId: aquizId
              })
            : "";
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ error, loading: false });
      });
  };

  async retrieveSessionToken() {
    try {
      const token = await AsyncStorage.getItem("loginToken");
      if (isLoggedIn !== null) {
        console.log("Session token", token);
        return token;
      }
    } catch (error) {
      console.log("Error while storing the token");
    }
  }

  sendUserVote = articleId => {
    axios
      .post("https://youthevoice.com/postarticlelikes", {
        userArticleVote: {
          userId: this.props.userId,
          articleId: articleId,
          upVote: this.state.upVote,
          dwVote: this.state.dwVote
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  _upVote = articleId => () => {
    if (!this.props.isAuthenticated) {
      this.props.navigation.navigate("YtvLogin", {
        articleID: articleId
      });
    } else {
      uvS = !this.state.upVote;

      this.setState(
        {
          upVote: uvS,
          dwVote: false
        },
        () => {
          this.sendUserVote(articleId);
        }
      );
    }
  };

  _dwVote = articleId => () => {
    if (!this.props.isAuthenticated) {
      this.props.navigation.navigate("YtvLogin", {
        articleID: articleId
      });
    } else {
      dvS = !this.state.dwVote;

      this.setState(
        {
          upVote: false,
          dwVote: dvS
        },
        () => {
          this.sendUserVote(articleId);
        }
      );
    }
  };

  _ytvShare = articleId => () => {
    this.props.navigation.navigate("YtvShare", {
      articleID: articleId
    });
  };

  _tellOption = () => {
    this.props.navigation.navigate("TellOption");
  };

  quizResults = aquizId => () => {
    this.props.navigation.navigate("QuizResuts", {
      quizId: aquizId
    });
  };

  allComments = () => {
    this.props.navigation.navigate("AllComments", {
      articleId: this.props.navigation.getParam("articleId", ""),
      parentCommentId: "c0"
    });
  };

  render() {
    const { navigation } = this.props;
    const detailData = this.state.articleData;
    //navigation.getParam("datailData", {});
    // this.getArticle(articleId);
    // console.log("detaill", detailData);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#bf360c" />
        <View>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{ flexDirection: "row", alignItems: "center", zIndex: 1 }}
          >
            <Icon name="ios-arrow-round-back" color="green" size={30} />
            <Text style={styles.logo}>Back...</Text>
          </TouchableOpacity>
        </View>
        <Loader loading={this.state.loadL} />
        {this.state.renderI && (
          <ScrollView>
            <View>
              <View style={styles.card}>
                <Text style={styles.cardHHeader}>
                  {detailData.articleHeading}
                </Text>

                <Image
                  source={{ uri: detailData.articleImage }}
                  style={styles.cardImage}
                />

                <HTML
                  html={detailData.articleLongDesc}
                  imagesMaxWidth={Dimensions.get("window").width}
                  baseFontStyle={{ fontSize: 16 }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    padding: 10
                  }}
                >
                  <TouchableOpacity
                    onPress={this._upVote(detailData.articleId)}
                  >
                    <Icon
                      name="md-thumbs-up"
                      size={30}
                      color={
                        this.state.upVote
                          ? this.state.upVoteTrueColor
                          : this.state.upVoteFalseColor
                      }
                    />
                    <Text style={{ paddingVertical: 5 }}> 20k</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this._dwVote(detailData.articleId)}
                  >
                    <Icon
                      name="md-thumbs-down"
                      size={30}
                      color={
                        this.state.dwVote
                          ? this.state.dwVoteTrueColor
                          : this.state.dwVoteFalseColor
                      }
                    />
                    <Text style={{ paddingVertical: 5 }}> 20k</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this._ytvShare(detailData.articleId)}
                  >
                    <Icon name="md-share-alt" size={30} />
                    <Text style={{ paddingVertical: 5 }}> 20k</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardHeader}>Watch Video...</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    padding: 10
                  }}
                >
                  <TouchableOpacity onPress={this.pVideo}>
                    <View style={styles.bottomBarItem}>
                      <Icon name="ios-videocam" size={30} />
                      <Text style={{ paddingVertical: 5 }}> Video</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    // onPress={this.openUrl("403845640359795")}
                    onPress={() =>
                      this.props.navigation.navigate("ImageGrid", {
                        articleId: this.state.articleId,
                        screenName: "DetailArticle"
                      })
                    }
                  >
                    <View style={styles.bottomBarItem}>
                      <Icon name="md-images" size={30} />
                      <Text style={{ paddingVertical: 5 }}> Images</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.openYUrl(
                      "https://www.youtube.com/watch?v=AEr7NcU8cHw"
                    )}
                  >
                    <View style={styles.bottomBarItem}>
                      <Icon name="logo-youtube" size={30} />
                      <Text style={{ paddingVertical: 5 }}> YouTube</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardHeader}>View Voices and Analysis</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    padding: 10
                  }}
                >
                  <TouchableOpacity onPress={this.allComments}>
                    <View style={styles.bottomBarItem}>
                      <Icon name="md-chatboxes" size={30} color="#388e3c" />
                      <Text style={{ paddingVertical: 5 }}> View Voices</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    // onPress={this.openUrl("403845640359795")}
                    onPress={() =>
                      this.props.navigation.navigate("VoiceAnalytics")
                    }
                  >
                    <View style={styles.bottomBarItem}>
                      <Fa5
                        name="chart-area"
                        size={30}
                        // color="white"
                        style={{ paddingRight: 5 }}
                      />
                      <Text style={{ paddingVertical: 5 }}>
                        {" "}
                        Voice Analytics
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("VoiceAnalytics")
                    }
                  >
                    <View style={styles.bottomBarItem}>
                      <Fa5
                        name="cloud-moon"
                        size={30}
                        // color="white"
                        style={{ paddingRight: 5 }}
                      />
                      <Text style={{ paddingVertical: 5 }}> Voice Cloud</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.ytvcard}>
                <Text style={styles.ytvcardHeader}>
                  Add Your Voice - Comment
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    padding: 10
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("YtvVoice", {
                        articleId: this.state.articleId,
                        screenName: "DetailArticle"
                      })
                    }
                  >
                    <View style={styles.bottomBarItem}>
                      <Image
                        style={{
                          height: 53,
                          width: 50,
                          resizeMode: "contain",
                          alignItems: "center",
                          paddingTop: 50
                        }}
                        source={require("./resources/ytvheader.png")}
                      />
                      <Text style={{ paddingVertical: 5, color: "#fff" }}>
                        {" "}
                        YTV Voice
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.openYUrl(
                      "https://twitter.com/jeevan72674854/status/1084291366371377152"
                    )}
                  >
                    <View style={styles.bottomBarItem}>
                      <Icon name="md-wifi" size={50} color="#fff" />
                      <Text style={{ paddingVertical: 5, color: "#fff" }}>
                        {" "}
                        Social Media
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {detailData.quiz.map((_quiz, j) => (
                <View key={j} style={styles.card}>
                  <Text style={styles.cardHeader}>Add Your Voice Quiz</Text>
                  <Text style={styles.question}>{_quiz.question}</Text>

                  <View key={j}>
                    {_quiz.options.map((data, i) => (
                      <View key={i} style={{ padding: 10 }}>
                        {this.createQuiz(data, j, i + 1)}
                      </View>
                    ))}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      padding: 10
                    }}
                  >
                    <TouchableOpacity
                      disabled={
                        !this.state["quiz" + j] ||
                        !this.state["quiz" + j + "Voted"]
                      }
                      onPress={this.onQuizCancel(j)}
                    >
                      <View style={styles.bottomBarItem}>
                        <Icon
                          name="ios-alert"
                          size={30}
                          color={
                            this.state["quiz" + j] &&
                            this.state["quiz" + j + "Voted"]
                              ? "#757575"
                              : "#cccccc"
                          }
                        />
                        <Text style={{ paddingVertical: 5 }}> Cancel</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={
                        !this.state["quiz" + j] ||
                        this.state["quiz" + j + "Voted"]
                      }
                      onPress={this.postQuiz(j, "A", _quiz.quizId)}
                    >
                      <View style={styles.bottomBarItem}>
                        <Icon
                          name="md-share-alt"
                          size={30}
                          color={
                            this.state["quiz" + j] &&
                            !this.state["quiz" + j + "Voted"]
                              ? "#757575"
                              : "#cccccc"
                          }
                        />
                        <Text style={{ paddingVertical: 5 }}> Vote</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={
                        !this.state["quiz" + j] &&
                        !this.state["quiz" + j + "Voted"]
                      }
                      onPress={this.quizResults(_quiz.quizId)}
                    >
                      <View style={styles.bottomBarItem}>
                        <Icon
                          name="md-chatboxes"
                          size={30}
                          color={
                            this.state["quiz" + j] &&
                            this.state["quiz" + j + "Voted"]
                              ? "#757575"
                              : "#cccccc"
                          }
                        />
                        <Text style={{ paddingVertical: 5 }}> Results</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.isAuthenticated,
    userId: state.userId
  };
};

export default connect(mapStateToProps)(DetailArticle);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e3f2fd" },
  question: {
    padding: 10,
    fontSize: 17
    //  fontWeight: "bold"
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
  ytvcard: {
    backgroundColor: "#212121",
    elevation: 3,
    marginVertical: 2
  },
  cardseparator: {
    borderBottomColor: "#d1d0d4",
    borderBottomWidth: 1
  },
  cardHHeader: {
    fontSize: 20,
    padding: 5,
    color: "#01579B",
    // fontWeight: "bold",
    //fontFamily: "Lobster-Regular"
    fontFamily: "OpenSans-SemiBold"
  },
  cardHeader: {
    fontSize: 18,
    padding: 5,
    color: "#bf360c",
    // fontWeight: "bold",
    // fontFamily: "Lobster-Regular"
    fontFamily: "OpenSans-SemiBold"
  },
  ytvcardHeader: {
    fontSize: 18,
    padding: 5,
    color: "#bf360c",
    // fontWeight: "bold",
    fontFamily: "Lobster-Regular"
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
    color: "#212121",
    padding: 5,
    letterSpacing: 2
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  }
});
