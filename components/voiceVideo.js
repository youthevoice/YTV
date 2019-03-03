import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert
} from "react-native";
import ImagePicker from "react-native-image-picker";
import axios from "axios";

import Fa5 from "react-native-vector-icons/FontAwesome5";

import Icon from "react-native-vector-icons/Ionicons";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import {
  Input,
  Divider,
  Button as Button1,
  Image
} from "react-native-elements";
var RNFS = require("react-native-fs");
import ProgressCircle from "react-native-progress-circle";
import RNFetchBlob from "rn-fetch-blob";
import { connect } from "react-redux";
import UUIDGenerator from "react-native-uuid-generator";

class VoiceVideo extends React.Component {
  state = {
    avatarSource: null,
    videoSource: null,
    vodeoSouceA: false,
    imageData: [],
    isUploading: false,
    uploadStatus: 0,
    uploadButton: false,
    jobId: 0,
    cameraDir: "",
    commentText: ""
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState(
      {
        articleId: this.props.navigation.getParam("articleId", ""),
        screenName: this.props.navigation.getParam("screenName", ""),
        parentCommentId: this.props.navigation.getParam("parentCommentId", "c0")
      },
      () => {
        console.log("I am in ONlyYTVVoice..VIDEOOOO..", this.state);
      }
    );
  }

  selectVideoTapped = () => {
    const options = {
      title: "Video Picker",
      takePhotoButtonTitle: "Take Video...",
      mediaType: "video",
      videoQuality: "low"
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);
      this.setState({ vodeoSouceA: false });
      console.log("RNFetchBlob.fs.dirs.DCIMDir", RNFetchBlob.fs.dirs.DCIMDir);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState(
          {
            uploadButton: true,
            vodeoSouceA: true,

            videoSource: response.path
          },
          () => {
            console.log("statetttt", this.state);
          }
        );
      }
    });
  };

  _updateRNFB = async fileName => {
    //alert("Uoloaddddd");

    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ); // I used redux saga here. 'yield' keywoard. You don't have to use that. You can use async - await or Promises.

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("upload started....");
          this.setState({ isUploading: true, vodeoSouceA: false });
          console.log(this.state.videoSource);
          task = RNFetchBlob.fetch(
            "POST",
            "https://youthevoice.com/postcomment",
            {
              "Content-Type": "application/octet-stream"
            },
            [
              {
                name: fileName,
                filename: fileName + ".mp4",

                // upload a file from asset is also possible in version >= 0.6.2
                data: RNFetchBlob.wrap(this.state.videoSource)
              }
            ]
          );
          this.setState({ task: task });

          task.uploadProgress({ interval: 1000 }, (loaded, total) => {
            this.setState({
              uploadStatus: Math.floor((loaded / total) * 100)
            });
            console.log("progress " + Math.floor((loaded / total) * 100) + "%");
          });

          task
            .then(res => {
              console.log("from resppooo", res.text());
              this.setState({
                uploadStatus: 100,
                isUploading: false
              });
            })
            .catch(err => {
              console.log("task erroroooooo", err);
            });
        }
      }
    } catch (e) {
      console.log("Cancellllll", e);
      this.setState({ task: "", isUploading: false });
    }
  };

  startUploadCancel = () => {
    Alert.alert(
      "Upload Cancel",
      "Do you want to cancel Upload...",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
            return;
          },
          style: "cancel"
        },
        { text: "OK", onPress: () => this.uploadCancel() }
      ],
      { cancelable: false }
    );
  };
  uploadCancel = () => {
    this.state.task.cancel();
    this.setState({ uploadCancel: true, isUploading: false });
    console.log("from state", this.state.task);
    //console.log("from fun", err + taskid);
  };

  getFilenameAndExtension = pathfilename => {
    var filenameextension = pathfilename.replace(/^.*[\\\/]/, "");
    var filename = filenameextension.substring(
      0,
      filenameextension.lastIndexOf(".")
    );
    var ext = filenameextension.split(".").pop();

    return ext;
  };

  _submitTextAudio = (articleId, screenName) => async () => {
    _uuid = await UUIDGenerator.getRandomUUID();
    console.log("satettt.......", this.state);

    axios
      .post("https://youthevoice.com/postTextAudioComment", {
        voiceType: "Video",
        commentId: _uuid,
        parentCommentId: this.state.parentCommentId,
        textComment: this.state.commentText,
        sourceId:
          _uuid + "." + this.getFilenameAndExtension(this.state.videoSource),
        videoFullPath: this.state.videoSource,
        screenName: "VoiceVideo",
        userId: this.props.userId,
        userName: this.props.sName,
        articleId: this.state.articleId,
        timeBeforeUpload: new Date(),
        likeCnt: 0,
        dlikeCnt: 0
      })
      .then(response => {
        this._updateRNFB(_uuid);
        console.log(response);
      })
      .catch(error => {
        console.log("errrorrrr", error);
      });
  };

  pVideo = () => {
    this.props.navigation.navigate("PlayVideo", {
      sourceId: this.state.videoSource
    });
  };

  render() {
    const { navigation } = this.props;
    const articleId = navigation.getParam("articleId", "");
    const screenName = navigation.getParam("screenName", "");

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="lght-content" backgroundColor="#bf360c" />
        <View>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{ flexDirection: "row", alignItems: "center", zIndex: 1 }}
          >
            <Icon name="ios-arrow-round-back" color="green" size={30} />
            <Text style={styles.logo}>Back...</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Input
            id="phonenumber"
            label="Enter Your Voice..."
            containerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}
            // placeholder="YOUR VOICE..."
            errorStyle={{ color: this.state.validPhone ? "green" : "red" }}
            //errorMessage="ENTER YOUR VOICE"
            multiline={true}
            onChangeText={commentText => this.setState({ commentText })}
          />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {!this.state.isUploading ? (
              <Button1
                buttonStyle={styles.LoginButtonUpload}
                type="outline"
                icon={
                  <Fa5
                    name="cloud-upload-alt"
                    size={15}
                    //color="white"
                    style={{ paddingRight: 5 }}
                  />
                }
                iconLeft
                title="Send Your Voice & Video"
                onPress={this._submitTextAudio(articleId, screenName)}
                disabled={!this.state.uploadButton}
              />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  alignItems: "center"
                }}
              >
                <TouchableOpacity onPress={this.startUploadCancel}>
                  <View style={styles.bottomBarItem}>
                    <Fa5 name="camera-retro" size={30} />
                    <Text style={{ paddingVertical: 5 }}> cancel</Text>
                  </View>
                </TouchableOpacity>

                <ProgressCircle
                  percent={this.state.uploadStatus}
                  radius={50}
                  borderWidth={8}
                  color="#3399FF"
                  shadowColor="#999"
                  bgColor="#fff"
                >
                  <Text style={{ fontSize: 18 }}>
                    {this.state.uploadStatus + "%"}
                  </Text>
                </ProgressCircle>
              </View>
            )}
            <Button1
              buttonStyle={styles.LoginButton}
              type="outline"
              icon={
                <Fa5
                  name="images"
                  size={20}
                  //color="white"
                  style={{ paddingRight: 5 }}
                />
              }
              iconLeft
              title="Select/Record Video"
              onPress={this.selectVideoTapped}
              disabled={this.state.isUploading}
            />
          </View>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Button1
            buttonStyle={styles.LoginButton}
            type="outline"
            icon={
              <Fa5
                name="images"
                size={20}
                //color="white"
                style={{ paddingRight: 5 }}
              />
            }
            iconLeft
            title="Play/Recorded Video"
            onPress={this.pVideo}
            disabled={!this.state.vodeoSouceA}
          />
        </View>
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
)(VoiceVideo);

var styles = StyleSheet.create({
  controls: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  progressText: {
    paddingTop: 5,
    paddingBottom: 10,
    fontSize: 20,
    color: "#000"
  },
  button: {
    padding: 20
  },
  disabledButtonText: {
    color: "#eee"
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  },
  DelButton: {
    //backgroundColor: "#D32F2F",
    borderRadius: 50,
    margin: 10,
    height: 40,
    width: 100
  },
  LoginButton: {
    //backgroundColor: "#4CAF50",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 250
  },
  LoginButtonPlay: {
    //backgroundColor: "#9E9E9E",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 200
  },
  LoginButtonUpload: {
    //backgroundColor: "#FF9800",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 250
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "blue",
    marginBottom: 10
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  },
  //container: { flex: 1, backgroundColor: "#e3f2fd" },
  container: { flex: 1, backgroundColor: "#fff" },
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
    color: "#1b5e20",
    paddingLeft: 5,
    letterSpacing: 2
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  },
  MainContainer: {
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 5
  },

  TextInputStyleClass: {
    textAlign: "center",
    height: 50,
    // borderWidth: 2,
    //borderColor: "#9E9E9E",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    height: 150
  }
});
