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
  StatusBar
} from "react-native";

import { Input, Button as Button1 } from "react-native-elements";

import Fa5 from "react-native-vector-icons/FontAwesome5";

import { RectButton, BorderlessButton } from "react-native-gesture-handler";

import Icon from "react-native-vector-icons/Ionicons";

export default class TellOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      option: "",
      validOption: false,
      reason: "",
      validReason: false
    };
  }

  validateOption = option => {
    if (/\S/.test(option)) {
      this.setState({ validOption: true, option: option });
      console.log("matched");
    } else {
      this.setState({ validOption: false });
      console.log("not  matched");
    }

    console.log(sname);
  };

  validReason = reason => {
    if (/\S/.test(reason)) {
      this.setState({ validReason: true, reason: reason });
      console.log("matched");
    } else {
      this.setState({ validReason: false });
      console.log("not  matched");
    }

    console.log(reason);
  };

  render() {
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
            <BorderlessButton>
              <Icon name="ios-search" color="#ffffff" size={30} />
            </BorderlessButton>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Input
              autoFocus
              id="phonenumber"
              containerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}
              placeholder="OPTION"
              leftIcon={
                <Fa5
                  name="list-ul"
                  size={18}
                  color={this.state.validOption ? "green" : "red"}
                />
              }
              errorStyle={{
                color: this.state.validateOption ? "green" : "red"
              }}
              errorMessage="ENTER NEW OPTION"
              onChangeText={option => this.validateOption(option)}
            />

            <Input
              containerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}
              placeholder="REASON"
              leftIcon={
                <Fa5
                  name="cloud-sun"
                  size={18}
                  color={this.state.validReason ? "green" : "red"}
                />
              }
              errorStyle={{ color: this.state.validReason ? "green" : "red" }}
              errorMessage="REASON FOR NEW OPTION"
              onChangeText={reason => this.validReason(reason)}
            />

            <Button1
              buttonStyle={styles.LoginButton}
              type="outline"
              icon={<Fa5 name="list-ol" size={18} />}
              iconLeft
              title=" SEND YOUR OPTION"
              titleStyle={{ paddingLeft: 10, fontSize: 14 }}
              onPress={this.signIn}
              disabled={
                this.state.validPhone && this.state.validSname ? false : true
              }
              loading={this.state.otpLoading}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
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
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  },
  buttonStyle: {
    borderRadius: 10,
    margin: 20,
    width: 200
  },
  LoginButton: {
    // backgroundColor: "#0d47a1",
    borderRadius: 50,
    padding: 10,
    height: 50,
    width: 200
  }
});
