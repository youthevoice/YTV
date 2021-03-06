import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView
} from "react-native";

import Fa5 from "react-native-vector-icons/FontAwesome5";

import Icon from "react-native-vector-icons/Ionicons";

export default class ytvLogin extends Component {
  _onPressPLogin = articleId => () => {
    this.props.navigation.navigate("PLogin", {
      articleID: articleId
    });
  };

  _onPressGLogin = articleId => () => {
    this.props.navigation.navigate("GLogin", {
      articleID: articleId
    });
  };

  _onPressFLogin = articleId => () => {
    this.props.navigation.navigate("FLogin", {
      articleID: articleId
    });
  };

  render() {
    const { navigation } = this.props;
    const articleID = navigation.getParam("articleID", "");

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#bf360c" />
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="ios-arrow-round-back" color="#fff" size={30} />
              <Text style={styles.logo}>Back...</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.h1w}>YTV Login</Text>
          </View>
          <View />
        </View>
        <ScrollView>
          <View style={styles.card}>
            <TouchableOpacity
              onPress={this._onPressPLogin(articleID)}
              style={styles.cardHeader}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Fa5 name={"mobile-alt"} size={20} />
                <Text style={styles.h1}>. Login with Phone</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <TouchableOpacity
              onPress={this._onPressGLogin(articleID)}
              style={styles.cardHeader}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Fa5 name={"google"} size={20} />
                <Text style={styles.h1}>. Login with Google</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <TouchableOpacity
              onPress={this._onPressFLogin(articleID)}
              style={styles.cardHeader}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Fa5 name={"facebook-f"} size={20} />
                <Text style={styles.h1}>. Login with Facebook</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e3f2fd" },

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

    paddingHorizontal: 15,
    paddingVertical: 30,
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
  }
});
