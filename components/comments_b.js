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
  AsyncStorage
} from "react-native";

import Fa5 from "react-native-vector-icons/FontAwesome5";

import Icon from "react-native-vector-icons/Ionicons";

import { Divider } from "react-native-elements";

import { Input, Button as Button1 } from "react-native-elements";
import axios from "axios";

import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import Loader from "./loader";

import { connect } from "react-redux";

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dotLoading: false,
      renderI: false,
      page: 0,
      data: [],
      upVote: false,
      dwVote: false,
      upVoteColor: "#9e9e9e",
      dwVoteColor: "#9e9e9e",
      upVoteTrueColor: "#42a5f5",
      upVoteFalseColor: "#9e9e9e",
      dwVoteTrueColor: "#424242",
      dwVoteFalseColor: "#9e9e9e"
    };
  }

  async componentDidMount() {
    this.setState(
      {
        articleId: this.props.navigation.getParam("articleId", "")
      },
      () => {
        this._getAllComments();
      }
    );
  }
  repliesToComment = () => {
    this.props.navigation.navigate("CommentReplies", {
      datailData: ""
    });
  };

  navigateToSource = (_voiceType, _sourceId) => () => {
    if (_voiceType == "Image") {
      this.props.navigation.navigate("CommentReplies", {
        datailData: ""
      });
    }

    if (_voiceType == "Video") {
      this.props.navigation.navigate("PlayVideo", {
        sourceId: "https://youthevoice.com/" + _sourceId
      });
    }

    if (_voiceType == "Audio") {
      console.log("AudiooooIDDDD", "https://youthevoice.com/" + _sourceId);
      this.props.navigation.navigate("PlaySound", {
        sourceId: "https://youthevoice.com/" + _sourceId
      });
    }
  };

  _ytvAppsVoice = () => {};

  renderItem = ({ item }) => (
    <View style={styles.card} key={item.commentId}>
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "OpenSans-SemiBold",
              paddingBottom: 2,
              paddingTop: 2,
              paddingLeft: 5
              // color: "#424242"
            }}
          >
            {item.userName.toUpperCase()}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              paddingBottom: 2,
              paddingTop: 1,
              paddingLeft: 5
            }}
          >
            {item.textComment}
          </Text>
        </View>
      </View>
      {item.voiceType == "Audio" && (
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={this.navigateToSource(item.voiceType, item.sourceId)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  paddingRight: 10,
                  fontFamily: "OpenSans-SemiBold"
                  //color: "#1b5e20"
                }}
              >
                Audio Voice
              </Text>

              <Button1
                buttonStyle={styles.audioButton}
                icon={<Fa5 name="headphones" size={15} color="white" />}
                iconLeft
                type={"clear"}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {item.voiceType == "Video" && (
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={this.navigateToSource(item.voiceType, item.sourceId)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  paddingRight: 10,
                  fontFamily: "OpenSans-SemiBold",
                  fontSize: 16
                  //color: "#1b5e20"
                }}
              >
                Video Voice
              </Text>

              <Button1
                buttonStyle={styles.videoButton}
                icon={<Fa5 name="video" size={15} color="white" />}
                iconLeft
                type={"clear"}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
      {item.voiceType == "Image" && (
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={styles.bottomBarItem}
            onPress={this.navigateToSource(item.voiceType, item.sourceId)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  paddingRight: 10,
                  fontFamily: "OpenSans-SemiBold"
                  //color: "#1b5e20"
                }}
              >
                Image Voice
              </Text>

              <Button1
                buttonStyle={styles.videoButton}
                icon={<Fa5 name="images" size={15} color="white" />}
                iconLeft
                type={"clear"}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10
        }}
      >
        <TouchableOpacity onPress={this._upVote(item.commentId)}>
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
        <TouchableOpacity onPress={this._dwVote(item.commentId)}>
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
        <TouchableOpacity onPress={this._ytvAppsVoice(this.state.articleId)}>
          <Icon name="md-share-alt" size={30} />
          <Text style={{ paddingVertical: 5 }}> 20k</Text>
        </TouchableOpacity>
      </View>

      <Divider style={{ backgroundColor: "#BDBDBD" }} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10
        }}
      >
        <TouchableOpacity onPress={this.repliesToComment}>
          <Text
            style={{
              fontSize: 14,
              color: "#1565C0",
              padding: 15
            }}
          >
            20K Replies...
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.repliesToComment}>
          <Button1
            buttonStyle={styles.DelButton}
            containerStyle={{ zIndex: 77 }}
            type="outline"
            icon={
              <Fa5
                name="ban"
                size={15}
                //color="white"
                style={{ paddingRight: 5 }}
              />
            }
            iconLeft
            title="Delete"
            //  onPress={this.deleteImage(item.name)}
            // disabled={this.state.isUploading}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.repliesToComment}>
          <Button1
            buttonStyle={styles.DelButton}
            containerStyle={{ zIndex: 77 }}
            type="outline"
            icon={
              <Fa5
                name="ban"
                size={15}
                //color="white"
                style={{ paddingRight: 5 }}
              />
            }
            iconLeft
            title="Report"
            //  onPress={this.deleteImage(item.name)}
            // disabled={this.state.isUploading}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  _keyExtractor = (item, index) => item.id;

  separator = () => <View style={styles.separator} />;

  _getAllComments = () => {
    console.log("aricleIDDDD", this.state.articleId);
    this.setState({ loading: true });
    const { page } = this.state;
    axios
      .get("https://youthevoice.com/getarticlecomments", {
        params: {
          articleId: this.state.articleId,
          page: page
        }
      })
      .then(res => {
        this.setState(
          {
            data: page === 0 ? res.data : [...this.state.data, ...res.data],
            //data: [...this.state.data, ...res.data],
            loading: false,
            renderI: true,

            loadDone: res.data.length <= 10 ? true : false
          },
          () => {
            console.log("Datatttt", this.state.data);
          }
        );
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      />
    );
  };

  findLastArticleId = () => {
    return this.state.data[this.state.data.length - 1].articlePk;
  };

  loadMore = () => {
    alert("jeevann...");
    //this.getAllArticles(this.findLastArticleId());

    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        if (!this.state.loadDone) {
          //(this.getAllArticles(this.state.page), 500);
          //debounce(this.getAllArticles(this.state.page), 1000);
          // alert("jeevann...");
          this.getAllArticles(this.state.page);
        }
        // this.getAllArticles(this.state.page);
      }
    );
  };

  _upVote = commentId => () => {
    if (!this.props.isAuthenticated) {
      this.props.navigation.navigate("YtvLogin", {
        articleID: this.state.articleId
      });
    } else {
      uvS = !this.state.upVote;

      this.setState(
        {
          upVote: uvS,
          dwVote: false
        },
        () => {
          console.log("CommenttttId", this.state);
          // this.sendUserVote(articleId);
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

  sendUserVote = articleId => {
    axios
      .post("https://youthevoice.com/postarticlelikes", {
        userCommentVote: {
          userId: this.props.userId,
          articleId: this.state.articleId,
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

  render() {
    // const { navigation } = this.props;
    // const articleID = navigation.getParam("articleID", "");

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#bf360c" />
        <View>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{ flexDirection: "row", alignItems: "center", zIndex: 1 }}
          >
            <Icon name="ios-arrow-round-back" color="green" size={30} />
            <Text style={styles.logo}>YTV-Back...</Text>
          </TouchableOpacity>
        </View>
        {this.state.renderI && (
          <ScrollView>
            <View style={{ borderTopLeftRadius: 7.5 }}>
              <FlatList
                keyExtractor={(item, index) => item.commentId}
                data={this.state.data}
                renderItem={this.renderItem}
                //  ListFooterComponent={this.renderFooter}
                // refreshing={this.state.refreshing}
                // onRefresh={this.handleRefresh}
                //  onEndReachedThreshold={0.1}
                //  onEndReached={this.loadMore}
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    authMethod: state.authMethod,
    userId: state.userId,
    sName: state.sName,
    isAuthenticated: state.isAuthenticated
  };
};

export default connect(
  mapStateToProps,
  null
)(Comments);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEEEEE" },
  question: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold"
  },
  DelButton: {
    //backgroundColor: "#D32F2F",
    borderRadius: 50,
    margin: 10,
    height: 40,
    width: 100
  },

  LoginButton: {
    backgroundColor: "#E64A19",
    borderRadius: 50,
    padding: 10,
    height: 40,
    width: 50
  },
  imageButton: {
    backgroundColor: "#0277BD",
    borderRadius: 50,
    padding: 10,
    height: 40,
    width: 50
  },
  audioButton: {
    backgroundColor: "#1b5e20",
    borderRadius: 50,
    padding: 5,
    height: 40,
    width: 50
  },
  videoButton: {
    backgroundColor: "#E64A19",
    borderRadius: 50,
    padding: 10,
    height: 40,
    width: 50
  },
  commentText: {
    fontSize: 16
  },
  qoption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  userDetails: {
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
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 10,
    color: "#bf360c",
    fontWeight: "bold"
  },
  commentUser: {
    fontSize: 16,
    padding: 10,
    //paddingTop: 10,
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
    //color: "#000",
    paddingLeft: 5,
    letterSpacing: 2
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#bf360c",
    paddingLeft: 5,
    letterSpacing: 2
  },
  h1w: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
    letterSpacing: 2
  },
  bottomBarItem: {
    alignItems: "flex-start",
    justifyContent: "center"
  }
});
