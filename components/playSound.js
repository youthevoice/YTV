import React from "react";
import {
  View,
  Image,
  Text,
  Slider,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet
} from "react-native";

import Sound from "react-native-sound";
import Icon from "react-native-vector-icons/Ionicons";

const img_speaker = require("./resources/splash.png");
const img_pause = require("./resources/ui_pause.png");
const img_play = require("./resources/ui_play.png");
const img_playjumpleft = require("./resources/ui_playjumpleft.png");
const img_playjumpright = require("./resources/ui_playjumpright.png");

export default class PlaySound extends React.Component {
  constructor() {
    super();
    this.state = {
      playState: "paused", //playing, paused
      playSeconds: 0,
      duration: 0
    };
    this.sliderEditing = false;
  }

  componentDidMount() {
    this.play();

    this.timeout = setInterval(() => {
      if (
        this.sound &&
        this.sound.isLoaded() &&
        this.state.playState == "playing" &&
        !this.sliderEditing
      ) {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({ playSeconds: seconds });
        });
      }
    }, 100);
  }
  componentWillUnmount() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
    if (this.timeout) {
      clearInterval(this.timeout);
    }
  }

  onSliderEditStart = () => {
    this.sliderEditing = true;
  };
  onSliderEditEnd = () => {
    this.sliderEditing = false;
  };
  onSliderEditing = value => {
    if (this.sound) {
      this.sound.setCurrentTime(value);
      this.setState({ playSeconds: value });
    }
  };

  play = async () => {
    if (this.sound) {
      this.sound.play(this.playComplete);
      this.setState({ playState: "playing" });
    } else {
      const filepath = this.props.navigation.getParam("sourceId", "");
      console.log("[Play]", filepath);

      this.sound = new Sound(filepath, undefined, error => {
        if (error) {
          console.log("failed to load the sound", error);
          Alert.alert("Notice", "audio file error. (Error code : 1)");
          this.setState({ playState: "paused" });
        } else {
          this.setState({
            playState: "playing",
            duration: this.sound.getDuration()
          });
          this.sound.play(this.playComplete);
        }
      });
    }
  };
  playComplete = success => {
    if (this.sound) {
      if (success) {
        console.log("successfully finished playing");
      } else {
        console.log("playback failed due to audio decoding errors");
        Alert.alert("Notice", "audio file error. (Error code : 2)");
      }
      this.setState({ playState: "paused", playSeconds: 0 });
      this.sound.setCurrentTime(0);
    }
  };

  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }

    this.setState({ playState: "paused" });
  };

  jumpPrev15Seconds = () => {
    this.jumpSeconds(-15);
  };
  jumpNext15Seconds = () => {
    this.jumpSeconds(15);
  };
  jumpSeconds = secsDelta => {
    if (this.sound) {
      this.sound.getCurrentTime((secs, isPlaying) => {
        let nextSecs = secs + secsDelta;
        if (nextSecs < 0) nextSecs = 0;
        else if (nextSecs > this.state.duration) nextSecs = this.state.duration;
        this.sound.setCurrentTime(nextSecs);
        this.setState({ playSeconds: nextSecs });
      });
    }
  };

  getAudioTimeString(seconds) {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return (
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      ":" +
      (s < 10 ? "0" + s : s)
    );
  }

  render() {
    const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
    const durationString = this.getAudioTimeString(this.state.duration);

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
        <View style={{ paddingTop: 50 }}>
          <Image
            source={img_speaker}
            style={{
              width: 150,
              height: 162,
              marginBottom: 35,
              alignSelf: "center"
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 15
            }}
          >
            <TouchableOpacity
              onPress={this.jumpPrev15Seconds}
              style={{ justifyContent: "center" }}
            >
              <Image
                source={img_playjumpleft}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  marginTop: 1,
                  color: "white",
                  fontSize: 12
                }}
              >
                15
              </Text>
            </TouchableOpacity>
            {this.state.playState == "playing" && (
              <TouchableOpacity
                onPress={this.pause}
                style={{ marginHorizontal: 20 }}
              >
                <Image source={img_pause} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
            )}
            {this.state.playState == "paused" && (
              <TouchableOpacity
                onPress={this.play}
                style={{ marginHorizontal: 20 }}
              >
                <Image source={img_play} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={this.jumpNext15Seconds}
              style={{ justifyContent: "center" }}
            >
              <Image
                source={img_playjumpright}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  marginTop: 1,
                  color: "white",
                  fontSize: 12
                }}
              >
                15
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginVertical: 15,
              marginHorizontal: 15,
              flexDirection: "row"
            }}
          >
            <Text style={{ color: "white", alignSelf: "center" }}>
              {currentTimeString}
            </Text>
            <Slider
              onTouchStart={this.onSliderEditStart}
              // onTouchMove={() => console.log('onTouchMove')}
              onTouchEnd={this.onSliderEditEnd}
              // onTouchEndCapture={() => console.log('onTouchEndCapture')}
              // onTouchCancel={() => console.log('onTouchCancel')}
              onValueChange={this.onSliderEditing}
              value={this.state.playSeconds}
              maximumValue={this.state.duration}
              maximumTrackTintColor="gray"
              minimumTrackTintColor="white"
              thumbTintColor="white"
              style={{
                flex: 1,
                alignSelf: "center",
                marginHorizontal: Platform.select({ ios: 5 })
              }}
            />
            <Text style={{ color: "white", alignSelf: "center" }}>
              {durationString}
            </Text>
          </View>
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
