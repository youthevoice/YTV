import React from "react";
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
  Button,
  ScrollView,
  AsyncStorage
} from "react-native";
import firebase from "react-native-firebase";

import Icon from "react-native-vector-icons/Ionicons";

import Fa5 from "react-native-vector-icons/FontAwesome5";

import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import axios from "axios";
import Loader from "./loader";

import { connect } from "react-redux";
import { fetchLoginDetails } from "./store/actions";
const img_speaker = require("./resources/splash.png");

class Articles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      page: 0,
      data: [],
      error: null,
      _id: -1,
      refreshing: false,
      loadDone: false,
      isModalVisible: false,
      loadL: false
    };
  }

  async componentDidMount() {
    this.props.afetchLoginDetails();
    this.getAllArticles();
    firebase.messaging().subscribeToTopic("ytv");
    this.checkPermission();
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;
      console.log(
        "notificationOpen.notification",
        notificationOpen.notification
      );
      var seen = [];
      this.props.navigation.navigate("DetailArticle", {
        articleId: notification.data.articleId
      });
      alert(
        JSON.stringify(notification.data, function(key, val) {
          if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
              return;
            }
            seen.push(val);
          }
          return val;
        })
      );
    }

    const channel = new firebase.notifications.Android.Channel(
      "ytvchannel",
      "YTV Channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("The YTV Channel");

    // Create the channel
    firebase.notifications().android.createChannel(channel);

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        var seen = [];
        alert(
          JSON.stringify(notification.data, function(key, val) {
            if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                return;
              }
              seen.push(val);
            }
            return val;
          })
        );
        firebase
          .notifications()
          .removeDeliveredNotification(notification.notificationId);
      });

    this.notificationDisplayedListener();
    this.notificationListener();
    // this.notificationOpenedListener();
  }

  componentWillUnmount() {
    this.notificationDisplayedListener;
    this.notificationListener;
    //  this.notificationOpenedListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log("IsEnabled...");
      try {
        this.getToken();
      } catch (err) {
        console.log("token errorrr", err);
      }
      console.log("After IsEnabled...");
    } else {
      console.log("Geting Permissionss...");
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    console.log("fcmToken", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log("GettingggfcmToken", fcmToken);
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  notificationDisplayedListener = () =>
    // app in foreground
    firebase.notifications().onNotificationDisplayed(notification => {
      console.log("onNotificationDisplayed");
      console.log(notification);
    });

  notificationListener = () =>
    // app in foreground
    firebase.notifications().onNotification(notification => {
      console.log("notificationListener");
      console.log(notification);

      const localNotification = new firebase.notifications.Notification({
        sound: "default",
        show_in_foreground: true,
        show_in_background: true
      })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data)
        .android.setChannelId("ytvchannel")
        //.android.setSmallIcon("@mipmap/ic_notification")
        .android.setColor("#F2C94C")
        .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications().displayNotification(localNotification);
      console.log("displayed");
      firebase
        .notifications()
        .removeDeliveredNotification(localNotification.notificationId);
    });

  notificationOpenedListener = () =>
    // app in background
    firebase.notifications().onNotificationOpened(notificationOpen => {
      console.log("notificationOpenedListener");
      console.log(notificationOpen);
      const { action, notification } = notificationOpen;
      firebase
        .notifications()
        .removeDeliveredNotification(notification.notificationId);
      console.log("OPEN:", notification);
    });

  notificationTokenListener = userId =>
    // listens for changes to the user's notification token and updates database upon change
    firebase.messaging().onTokenRefresh(notificationToken => {
      console.log("notificationTokenListener");
      console.log(notificationToken);

      return firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .update({ pushToken: notificationToken, updatedAt: ts })
        .then(ref => {
          console.log("savePushToken success");
        })
        .catch(e => {
          console.error(e);
        });
    });

  _keyExtractor = (item, index) => item.id;

  separator = () => <View style={styles.separator} />;

  getAllArticles = () => {
    this.setState({ loading: true });
    const { page } = this.state;
    axios
      .get("https://youthevoice.com/articles", {
        params: {
          page: page
        }
      })
      .then(res => {
        this.setState({
          data: page === 0 ? res.data : [...this.state.data, ...res.data],
          //data: [...this.state.data, ...res.data],
          loading: false,
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

  _onPressShare = articleId => {
    this.props.navigation.navigate("ArticleShare", {
      shareData: "res.data"
    });
  };

  _onPress1 = articleId => {
    /* 1. Navigate to the Details route with params */

    this.props.navigation.navigate("DetailArticle", {
      articleId: articleId
    });
  };

  _onPress = articleId => {
    /* 1. Navigate to the Details route with params */

    this.props.navigation.navigate("DetailArticle", {
      articleId: articleId
    });
    /*
    this.setState({ loadL: true });

    axios
      .get("https://youthevoice.com/getarticles", {
        params: {
          articleId: articleId
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          loadL: false
        });
        this.props.navigation.navigate("DetailArticle", {
          datailData: res.data
        });
      })
      .catch(error => {
        this.setState({ error, loadL: false });
      });
      */
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        page: 0
      },
      () => {
        this.getAllArticles();
      }
    );
  };

  renderFooter = () => {
    //if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        {this.state.loadDone ? (
          <Text> Reached End..., Try Pulling down for latest updates...</Text>
        ) : (
          <ActivityIndicator animating size="large" />
        )}
      </View>
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

  renderHeader = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  navigateComments = _articleId => {
    this.props.navigation.navigate("YtvVoice", {
      articleId: _articleId,
      screenName: "AllArticles"
    });
  };

  renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => this._onPress(item.articleId)}>
        <Text style={styles.cardHeader}>{item.articleHeading}</Text>
        <Image source={{ uri: item.articleImage }} style={styles.cardImage} />
        <Text style={styles.cardText}>{item.articleShortDesc}</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10
        }}
      >
        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() =>
            this.props.navigation.navigate("YtvShare", {
              datailData: item.articlePk
            })
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon name="md-share-alt" size={30} color="#388e3c" />
            <Text style={styles.share}>Share</Text>
          </View>
          <Text style={{ paddingVertical: 5 }}> {item.no_of_shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBarItem}
          onPress={() => this.navigateComments(item.articleId)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="md-chatboxes" size={30} color="#388e3c" />
            <Text style={styles.share}>Add-View Voice</Text>
          </View>
          <Text style={{ paddingVertical: 5 }}> {item.no_of_comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#bf360c" />
        <View style={styles.body}>
          <View style={styles.headerBar}>
            <View style={styles.headerBar2}>
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

              <Text style={styles.logo}>YouTheVoice</Text>
            </View>
          </View>
          <Loader loading={this.state.loadL} />
          <View style={{ borderTopLeftRadius: 7.5 }}>
            <FlatList
              keyExtractor={(item, index) => item.articleId}
              data={this.state.data}
              renderItem={this.renderItem}
              ListFooterComponent={this.renderFooter}
              refreshing={this.state.refreshing}
              // onRefresh={this.handleRefresh}
              onEndReachedThreshold={0.1}
              onEndReached={this.loadMore}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapDispathToProps = dispatch => {
  return {
    afetchLoginDetails: () => dispatch(fetchLoginDetails())
  };
};

export default connect(
  null,
  mapDispathToProps
)(Articles);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  headerBar1: {
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
  headerBar: {
    // flexDirection: "row",
    height: 75,
    backgroundColor: "#212121",
    justifyContent: "center",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10
  },
  headerBar2: {
    flexDirection: "row",

    justifyContent: "center",
    // justifyContent: "space-around",
    alignItems: "center"
  },
  body: {
    flex: 1,
    backgroundColor: "#e1f5fe"
  },
  logo: {
    fontSize: 23,
    //fontFamily: "Lobster-Regular",
    fontFamily: "OpenSans-SemiBold",
    // fontWeight: "bold",
    color: "#fff",
    //paddingLeft: 5,
    letterSpacing: 2,
    paddingLeft: 10
  },
  bottomBar: {
    flexDirection: "row",
    height: 60,
    //backgroundColor: "#e1f5fe",
    backgroundColor: "#fff",
    borderTopWidth: 2,
    borderTopColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 3
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  },
  bottomBarTitle: {
    fontSize: 12,
    fontFamily: "Lobster-Regular",
    color: "#388e3c"
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
    color: "#616161",
    fontFamily: "OpenSans-SemiBold"
    //fontWeight: "bold"
  },
  cardImage: {
    width: null,
    height: 100
  },
  cardText: {
    fontSize: 16,
    padding: 5,
    color: "#616161"
    //lineHeight: 1
  },
  share: { padding: 5, color: "#388e3c", fontFamily: "OpenSans-SemiBold" }
});
