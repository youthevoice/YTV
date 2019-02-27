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

export default class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dotLoading: false,
      renderI: false,
      page: 0,
      data: []
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
        datailData: ""
      });
    }

    if (_voiceType == "Audio") {
      console.log("AudiooooIDDDD", "https://youthevoice.com/" + _sourceId);
      this.props.navigation.navigate("PlaySound", {
        sourceId: "https://youthevoice.com/" + _sourceId
      });
    }
  };

  renderItem = ({ item }) => (
    <View style={styles.card} key={item.commentId}>
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 16,
              // fontFamily: "Lobster-Regular",
              paddingBottom: 2,
              paddingTop: 2,
              paddingLeft: 5
              // color: "#424242"
            }}
          >
            {item.userName}
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

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            paddingBottom: 15
          }}
        >
          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="md-thumbs-up" size={30} />
              <Text style={{ padding: 10 }}> 787</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="md-thumbs-down" size={30} />
              <Text style={{ padding: 10 }}> 187</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Divider style={{ backgroundColor: "#BDBDBD" }} />
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
            <Text style={styles.logo}>Back...</Text>
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
/*
const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    authMethod: state.authMethod,
    userId: state.userId,
    sName: state.sName,
    isAuthenticated: state.isAuthenticated
  };
};

const mapDispathToProps = dispatch => {
  return {
    userLogout: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(AllComments);
*/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEEEEE" },
  question: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold"
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
    color: "#000",
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
    alignItems: "center",
    justifyContent: "center"
  }
});
