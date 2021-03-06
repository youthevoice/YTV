import React from "react";
import {
  AppRegistry,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  Alert
} from "react-native";
import ImagePicker from "react-native-image-picker";
import axios from "axios";
import UUIDGenerator from "react-native-uuid-generator";
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

class VoiceImage extends React.Component {
  state = {
    avatarSource: null,
    videoSource: null,
    imageData: [],
    isUploading: false,
    uploadStatus: 0,
    uploadButton: false,
    jobId: 0,
    uploadCancel: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const dirs = RNFetchBlob.fs.dirs;
    //  console.log("dcimmmm", dirs);
    this.setState({
      voiceType: "Image",
      PictureDir: dirs.PictureDir,
      articleId: this.props.navigation.getParam("articleId", ""),
      screenName: this.props.navigation.getParam("screenName", ""),
      parentCommentId: this.props.navigation.getParam("parentCommentId", "c0")
    });
  }

  selectPhotoTapped = () => {
    const options = {
      quality: 0.5,
      maxWidth: 1080,
      maxHeight: 1350,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        let newImages = [];
        let image = {
          name: response.fileName.replace(/(.*)\.(.*?)$/, "$1"),
          filename: response.fileName,
          imageW: response.width,
          imageH: response.height,
          sourceURI: response.uri,
          data: RNFetchBlob.wrap(response.path)
        };
        console.log("Response = ", response);
        newImages.push(image);

        console.log("imagessss", image);
        console.log("Newwwimagessss", newImages);

        this.setState(
          {
            sourceURI: response.uri,
            uploadButton: true,
            avatarSource: source,
            imageData: [...this.state.imageData, ...newImages]
          },
          () => {
            console.log("statetttt", this.state);
          }
        );
      }
    });
  };

  _checkImages = imageUri => () => {
    this.props.navigation.navigate("CheckImages", {
      imageUri: imageUri
    });
  };

  deleteImage = imageId => () => {
    //  alert("delete image...");
    let filteredArray = this.state.imageData.filter(
      item => item.name !== imageId
    );
    if (filteredArray.length > 0) {
      console.log("Image Dataaaa", this.state.imageData.length);
      this.setState({ imageData: filteredArray });
    } else {
      this.setState({ imageData: filteredArray, uploadButton: false });
    }
  };

  _submitTextAudio = (articleId, screenName) => async () => {
    const iData = ([
      { filename = null, imageH = null, imageW = null } = {}
    ] = this.state.imageData);
    console.log("iDAtaaaaa", iData);
    axios
      .post("https://youthevoice.com/postTextAudioComment", {
        voiceType: "Image",
        commentId: this.state.imageData[0].name,
        parentCommentId: this.state.parentCommentId,
        textComment: this.state.commentText,
        sourceId: this.state.imageData,
        screenName: "VoiceImage",
        userId: this.props.userId,
        userName: this.props.sName,
        articleId: this.state.articleId,
        timeBeforeUpload: new Date(),
        likeCnt: 0,
        dlikeCnt: 0
      })
      .then(response => {
        // this.uploadFile();
        this._updateRNFB();
        console.log(response);
      })
      .catch(error => {
        console.log("errrorrrr", error);
      });
  };
  _test1 = () => {
    alert("helloooo");
  };

  _updateRNFB = async () => {
    //alert("Uoloaddddd");

    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ); // I used redux saga here. 'yield' keywoard. You don't have to use that. You can use async - await or Promises.

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("upload started....");
          this.setState({ isUploading: true });
          const dirs = RNFetchBlob.fs.dirs;
          console.log("dcimmmm", dirs);

          var files = this.state.imageData;
          task = RNFetchBlob.fetch(
            "POST",
            "https://youthevoice.com/postcomment",
            {
              "Content-Type": "multipart/form-data"
            },
            files
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
              console.log(
                "dsasdasDas",
                this.state.screenName,
                this.state.articleId
              );
              if (
                this.state.screenName == "DetailArticle" &&
                this.state.articleId != null &&
                this.state.articleId != ""
              ) {
                this.props.navigation.navigate("DetailArticle", {
                  articleId: this.state.articleId
                });
              } else if (
                this.state.screenName != null &&
                this.state.screenName != ""
              ) {
                this.props.navigation.navigate(this.state.screenName);
              } else {
                this.props.navigation.navigate("AllArticles");
              }
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

  render() {
    const { navigation } = this.props;
    const articleId = navigation.getParam("articleId", "");
    const screenName = navigation.getParam("screenName", "");

    let originalWidth = 1080;
    let originalHeight = 1350;
    let windowWidth = Dimensions.get("window").width;
    let widthChange = windowWidth / originalWidth;
    let newWidth = originalWidth * widthChange;
    let newHeight = originalHeight * widthChange;
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
        <View style={{ zIndex: 88 }}>
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
                    // color="white"
                  />
                }
                iconLeft
                title="Send Your Voice & Images"
                titleStyle={{ paddingLeft: 10 }}
                onPress={this._submitTextAudio(articleId, screenName)}
                disabled={
                  !this.state.uploadButton && this.state.imageData.length == 0
                }
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
                <Button1
                  buttonStyle={styles.DelButton}
                  containerStyle={{ zIndex: 77 }}
                  type="outline"
                  icon={
                    <Fa5
                      name="bell-slash"
                      size={15}
                      //color="white"
                      style={{ paddingRight: 5 }}
                    />
                  }
                  iconLeft
                  title="Cancel "
                  onPress={this.startUploadCancel}
                  // loading={this.state.recording}
                />

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
                  size={15}
                  //color="white"
                  style={{ paddingRight: 5 }}
                />
              }
              iconLeft
              title="Select/Take Photo"
              titleStyle={{ paddingLeft: 10 }}
              onPress={this.selectPhotoTapped}
              disabled={this.state.isUploading}
            />
          </View>
        </View>
        <ScrollView style={{ zIndex: 77 }}>
          <View>
            {this.state.imageData.map(item => (
              <View key={item.name + "v"}>
                <Image
                  containerStyle={{ padding: 5, borderRadius: 10 }}
                  resizeMode="contain"
                  source={{
                    //  uri: "file://" + this.state.PictureDir + "/" + item.filename
                    uri: item.sourceURI
                  }}
                  style={{ width: null, height: 200, padding: 10 }}
                  PlaceholderContent={<ActivityIndicator />}
                />
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
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
                    onPress={this.deleteImage(item.name)}
                    disabled={this.state.isUploading}
                  />
                  <Button1
                    buttonStyle={styles.DelButton}
                    containerStyle={{ zIndex: 77 }}
                    type="outline"
                    icon={
                      <Fa5
                        name="image"
                        size={15}
                        //color="white"
                        style={{ paddingRight: 5 }}
                      />
                    }
                    iconLeft
                    title="Check"
                    onPress={this._checkImages(
                      // "file://" + this.state.PictureDir + "/" + item.filename
                      this.state.sourceURI
                    )}
                    disabled={this.state.isUploading}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
)(VoiceImage);

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
    // backgroundColor: "#4CAF50",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 250
  },
  LoginButtonPlay: {
    backgroundColor: "#9E9E9E",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 200
  },
  LoginButtonUpload: {
    // backgroundColor: "#FF9800",
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
    shadowOpacity: 1.0,
    zIndex: 99
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
