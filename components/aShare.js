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

import Share from "react-native-share";
import Fa5 from "react-native-vector-icons/FontAwesome5";

import Icon from "react-native-vector-icons/Ionicons";

export default class Tshare1 extends Component {
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

  render() {
    // const { navigation } = this.props;
    //const detailData = navigation.getParam("datailData", {});

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
        <ScrollView>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>
              Please share this Article. Thank You.
            </Text>

            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 40,
                  paddingHorizontal: 20
                }}
              >
                <TouchableOpacity
                  style={styles.bottomBarItem}
                  onPress={() => this.onShare()}
                >
                  <Fa5 name={"whatsapp"} size={40} color="#25D366" />
                  <Text style={{ paddingVertical: 5 }}> WHATSAPP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBarItem}
                  onPress={this.openFUrl("403845640359795")}
                >
                  <Fa5 name={"facebook"} size={40} color="#3b5998" />
                  <Text style={{ paddingVertical: 5 }}> FACEBOOK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBarItem}
                  onPress={this.openUrl(
                    "https://twitter.com/ew8dotcom/status/1084291751374962689"
                  )}
                >
                  <Fa5 name={"twitter"} size={40} color="#38A1F3" />
                  <Text style={{ paddingVertical: 5 }}> TWITTER</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 20
                }}
              >
                <TouchableOpacity
                  style={styles.bottomBarItem}
                  onPress={() => this.onShare1()}
                >
                  <Fa5 name={"envelope"} size={40} color="#880e4f" />
                  <Text style={{ paddingVertical: 5 }}> EMAIL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBarItem}
                  onPress={this.openUrl(
                    "https://www.reddit.com/r/assholedesign/comments/a02ezp/meta_is_it_asshole_design_a_handy_flowchart/"
                  )}
                >
                  <Fa5 name={"reddit"} size={40} color="#FF4500" />
                  <Text style={{ paddingVertical: 5 }}> REDDIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                  <Fa5 name={"instagram"} size={40} color="#3f729b" />
                  <Text style={{ paddingVertical: 5 }}> INSTAGRAM</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 20
                }}
              >
                <TouchableOpacity
                  style={styles.bottomBarItem}
                  onPress={() => this.onShare1()}
                >
                  <Fa5 name={"youtube"} size={40} color="#c4302b" />
                  <Text style={{ paddingVertical: 5 }}> YOUTUBE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomBarItem}
                  onPress={this.openUrl(
                    "https://www.reddit.com/r/assholedesign/comments/a02ezp/meta_is_it_asshole_design_a_handy_flowchart/"
                  )}
                >
                  <Fa5 name={"pinterest"} size={40} color="#DD4B39" />
                  <Text style={{ paddingVertical: 5 }}> PINTREST</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                  <Fa5 name={"quora"} size={40} color="#a62100" />
                  <Text style={{ paddingVertical: 5 }}> QUORA</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

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
