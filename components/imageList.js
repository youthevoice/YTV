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
  ScrollView,
  Linking,
  AlertIOS,
  AsyncStorage,
  Dimensions
} from "react-native";

import Fa5 from "react-native-vector-icons/FontAwesome5";

import Icon from "react-native-vector-icons/Ionicons";

import { Divider, Image } from "react-native-elements";

import { Input, Button as Button1 } from "react-native-elements";
import axios from "axios";
import { data as testData } from "./data";

export default class ImageList extends Component {
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
        commentId: this.props.navigation.getParam("commentId", "")
      },
      () => {
        this._getCommentImages();
      }
    );
  }

  renderItem = ({ item }) => {
    console.log("imagesss Item", item);
    let originalWidth = item.imageW;
    let originalHeight = item.imageH;
    let windowWidth = Dimensions.get("window").width;
    let widthChange = windowWidth / originalWidth;
    let newWidth = originalWidth * widthChange;
    let newHeight = originalHeight * widthChange;
    return (
      <View key={item.name}>
        <Text> </Text>
        <Image
          source={{ uri: "https://youthevoice.com/" + item.filename }}
          style={{ width: newWidth, height: newHeight }}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>
    );
  };

  _keyExtractor = (item, index) => item.id;

  separator = () => <View style={styles.separator} />;

  _getCommentImages = () => {
    console.log("aricleIDDDD", this.state.articleId);
    this.setState({ loading: true });
    const { page } = this.state;
    axios
      .get("https://youthevoice.com/getcommentimages", {
        params: {
          commentId: this.state.commentId,
          page: page
        }
      })
      .then(res => {
        this.setState({
          data: page === 0 ? res.data : [...this.state.data, ...res.data],
          //data: [...this.state.data, ...res.data],
          loading: false,
          renderI: true,
          loadDone: res.data.length <= 10 ? true : false
        });
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
        <View style={styles.headerBar}>
          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="ios-arrow-round-back" color="#fff" size={30} />
              <Text style={styles.logo}>Back...</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.h1w}>Voices</Text>
          </View>
        </View>
        {this.state.renderI && (
          <ScrollView>
            <View style={{ borderTopLeftRadius: 7.5 }}>
              <Text> ghfgfgfghfhgf</Text>
              <FlatList
                keyExtractor={(item, index) => item.name}
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
  container: { flex: 1, backgroundColor: "#e3f2fd" },
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
    color: "#fff",
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
