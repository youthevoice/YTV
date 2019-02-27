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
  Image
} from "react-native";

//import images from "./imageBase64";
import Icon from "react-native-vector-icons/Ionicons";
import { Slider } from "react-native-elements";

import axios from "axios";

export default class CheckImages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dotLoading: false,
      english: true,
      telugu: false,
      renderI: false,
      data: {}
    };
  }

  componentDidMount() {
    this._getQuizResults();
  }

  _getQuizResults = () => {
    fetch("https://youthevoice.com/getquizdetails/", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quizId: "11"
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("responseJson.data", responseJson.data);
        this.setState({ data: responseJson.data, renderI: true });
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    //  const quizResults = this.state.articleData;

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
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Thank You for Voting</Text>

          <View style={{ padding: 10 }}>
            <Text>Quiz Results</Text>
          </View>
          {this.state.renderI && (
            <View>
              {this.state.data.options.map((ops, i) => (
                <View key={i} style={{ padding: 10 }}>
                  <Text>
                    {this.state.data.totalVotes > 0
                      ? Math.round(
                          (ops.voices / this.state.data.totalVotes) * 100
                        )
                      : 0}
                  </Text>
                  <Slider
                    value={
                      this.state.data.totalVotes > 0
                        ? ops.voices / this.state.data.totalVotes
                        : 0
                    }
                  />
                  <Text> {ops.option}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
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
    opacity: 0,

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
    letterSpacing: 2,
    opacity: 1
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
  LoginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 200
  }
});
