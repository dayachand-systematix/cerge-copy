import React from "react";
import { connect } from "react-redux";
import Moment from "moment";
import Permissions from "react-native-permissions";
import { Container, Content } from "native-base";
import ImagePicker from "react-native-image-picker";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import AsyncStorage from "@react-native-community/async-storage";
import {
  View,
  StyleSheet,
  Keyboard,
  Platform,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  StatusBar,
  BackHandler
} from "react-native";
import styles from "../../../assets/styles";
import { ValidationComponent, Toast } from "../../../helper";
import {
  InputBox,
  Loader,
  HeaderContent,
  Button,
  DatePickerInput,
  Text
} from "../../common";
import {
  getUserProfileAction,
  updateUserProfileAction
} from "../../../actions/Profile";
import { UpdateShoppingStatusAction } from "../../../actions/Shopping";
import { LABELS } from "../../../languageConstants";
import {
  PROFILE_FILE_SIZE,
  MESSAGES,
  STATUS_CODES,
  API,
  DATE_FORMAT
} from "../../../config";
import {SHOPPING} from "../../../constants";

class BasicProfile extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      dob: "",
      sex: "",
      preferences: "",
      profilePhoto: "",
      isSubmitted: false,
      emailAddess: "",
      errorImage: "",
      showLoader: false,
      isProfileCreated: false,
      shoppingStatusData: "",
      newDate: ""
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    const {
      userProfile: { basicUserInfo, shoppingStatus }
    } = this.props;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const newDate = new Date(year - 16, month, day); // MINUS 15 YEAR
    console.log("newDate", newDate);
    this.setState({ newDate }, () => {
      this.setInitialData(basicUserInfo, shoppingStatus);
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton = () => {
    if (this.state.isProfileCreated === false) {
      return true;
    } else {
      return false;
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.userProfile &&
      nextProps.userProfile.basicUserInfo &&
      nextProps.userProfile != this.props.userProfile
    ) {
      const {
        userProfile: { basicUserInfo, shoppingStatus }
      } = nextProps;
      this.setInitialData(basicUserInfo, shoppingStatus);
    }
  }

  /**
   * @method setInitialData
   *@description called to set data initiallly
   */
  setInitialData = (basicUserInfo, shoppingStatus) => {
    if (
      basicUserInfo &&
      basicUserInfo !== undefined &&
      basicUserInfo !== null &&
      basicUserInfo.name
    ) {
      const {
        name,
        sex,
        profilePhoto,
        emailAddess,
        preferences
      } = basicUserInfo;
      console.log("basicUserInfo", basicUserInfo);
      const dob =
        basicUserInfo &&
        basicUserInfo.dob &&
        basicUserInfo.dob != undefined &&
        basicUserInfo.dob != null
          ? Moment(basicUserInfo.dob).format(DATE_FORMAT)
          : "";
      this.setState({
        name,
        sex,
        dob,
        profilePhoto:
          profilePhoto != "" && profilePhoto != null
            ? API.DownloadImage + "?key=" + profilePhoto
            : "",
        emailAddess,
        preferences,
        isProfileCreated: true
      });
    }
    if (
      shoppingStatus &&
      shoppingStatus != null &&
      shoppingStatus != undefined
    ) {
      this.setState({ shoppingStatusData: shoppingStatus });
    }
  };

  /**
   * @method checkValidation
   *@description called to check validations
   */
  checkValidation = () => {
    /* Call ValidationComponent validate method */
    this.validate({
      name: {
        required: true,
        maxlength: 25
      },
      dob: {
        required: true
      }
    });
    this.setState({ error: true });
  };

  /**
   * @method onInputValueChanged
   * @description called when input field value changes
   */
  onInputValueChanged = key => value => {
    const state = this.state;
    state[key] = value;
    this.setState(state, () => {
      if (this.state.isSubmitted) {
        this.checkValidation();
      }
    });
  };

  callUpdateStatusAPI = callback => {
    const requestData = {
      userShoppingStatus: {
        shoppingStatus: SHOPPING,
        shoppingRequirement: "",
        shoppingDate: "",
        fromTime: "",
        toTime: ""
      }
    };
    this.props.UpdateShoppingStatusAction(requestData, res => {
      callback();
    });
  };

  /**
   * @method onPressProfileButton
   * @description login takes user the app stack by setting isLoggedIn in AsncStorage
   */
  onPressProfileButton = redirectScreen => {
    Keyboard.dismiss();
    this.setState({ isSubmitted: true });
    this.checkValidation();
    const shoppingTodayDate = Moment().format(DATE_FORMAT);
    const {
      name,
      dob,
      sex,
      emailAddess,
      profilePhoto,
      preferences,
      shoppingStatusData
    } = this.state;
    const requestData = {
      basicUserInfo: {
        name,
        dob: Moment(dob, DATE_FORMAT).format(),
        sex,
        emailAddess,
        preferences
      }
    };
    const {
      userProfile: { shoppingStatus }
    } = this.props;
    const isStatusUpdated =
      shoppingStatus &&
      shoppingStatus != null &&
      shoppingStatus.shoppingStatus &&
      shoppingStatus.shoppingStatus != ""
        ? true
        : false;
    console.log("requestData requestData", requestData);

    if (profilePhoto != "" && profilePhoto.includes("base64")) {
      requestData.basicUserInfo.profilePhoto = profilePhoto;
    }

    if (this.isFormValid() && sex !== "") {
      this.setState({ showLoader: true });
      this.props.updateUserProfileAction(requestData, res => {
        if (
          res &&
          res.data &&
          res.data.code &&
          res.data.code == STATUS_CODES.OK
        ) {
          Toast.showToast(MESSAGES.PROFILE_UPDATE_SUCESS, "success");

          if (isStatusUpdated == false) {
            this.callUpdateStatusAPI(() => {
              this.getUserInfo(redirectScreen);
            });
          } else {
            this.getUserInfo(redirectScreen);
          }
        } else {
          this.setState({ showLoader: false });
        }
      });
    }
  };

  getUserInfo = redirectScreen => {
    this.props.getUserProfileAction(response => {
      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.userProfile
      ) {
        this.setState({ showLoader: false });
        const { userProfile } = response.data.data;
        AsyncStorage.setItem("userProfile", JSON.stringify(userProfile)).then(
          () => {
            this.props.navigation.navigate(redirectScreen);
          }
        );
      } else {
        this.setState({ showLoader: false });
        this.props.navigation.navigate("Auth");
      }
    });
  };

  /**
   * @method onPressPreferenceNavBtn
   * @description redirect on user's cloth prefences
   */
  onPressPreferenceNavBtn = () => {
    this.props.navigation.navigate("UserProfile");
  };

  /**
   * @method onPressRadioButton
   * @description On press radio button select type
   */
  onPressRadioButton = obj => {
    this.setState({ sex: obj.value });
  };

  /**
   * @method renderRadioButtons
   * @description Render custom radio button for both android and ios
   */
  renderRadioButtons = () => {
    const options = [
      {
        label: "Female",
        value: "Female"
      },
      {
        label: "Male",
        value: "Male"
      }
    ];
    const { sex, isSubmitted } = this.state;
    return options.map((obj, i) => {
      return (
        <RadioButton labelHorizontal key={i} accessible>
          <RadioButtonLabel
            obj={obj}
            index={i}
            onPress={() => this.onPressRadioButton(obj)}
            labelStyle={[
              styles.checkboxLabel,
              { width: 100, textAlign: "center", paddingTop: 8 }
            ]}
            labelWrapStyle={{}}
          />
          <RadioButtonInput
            obj={obj}
            index={i}
            isSelected={
              sex != "" && sex != null
                ? sex.toLowerCase() === obj.value.toLowerCase()
                : false
            }
            onPress={() => this.onPressRadioButton(obj)}
            borderWidth={1}
            buttonInnerColor={"#0f91db"}
            buttonOuterColor={isSubmitted && sex === "" ? "red" : "#000"}
            buttonSize={25}
            buttonOuterSize={34}
            buttonStyle={{}}
            buttonWrapStyle={{ marginTop: 5 }}
          />
        </RadioButton>
      );
    });
  };

  /**
   * @method openProfileImageChooser
   * @description for profile image picker
   */
  openProfileImageChooser = () => {
    const options = {
      title: "Select Image",
      noData: false,
      takePhotoButtonTitle: "Capture from Camera", // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: "Select from Gallery", // specify null or empty string to remove this button
      quality: 0.6,
      maxWidth: 200,
      maxHeight: 200,
      storageOptions: {
        skipBackup: true,
        cameraRoll: true,
        waitUntilSaved: true
      }
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        this.setState({ isImagePickerTapable: true, showLoader: false });
      } else if (response.error) {
        this.setState({ isImagePickerTapable: true, showLoader: false });
      } else if (response.customButton) {
        this.setState({ isImagePickerTapable: true, showLoader: false });
      } else {
        let fileType = "image/png";
        if (response.type != null) {
          fileType = response.type;
        }
        const size = response.fileSize;
        if (
          size <= PROFILE_FILE_SIZE &&
          (fileType.includes("image") ||
            fileType.includes(".jpg") ||
            fileType.includes(".jpeg") ||
            fileType.includes(".png"))
        ) {
          let source = "data:image/jpeg;base64," + response.data;
          this.setState({
            profilePhoto: source,
            showLoader: false,
            errorImage: ""
          });
        } else {
          this.setState({
            isImagePickerTapable: true,
            showLoader: false
          });
          Toast.showToast(MESSAGES.MAX_UPLOAD_IMAGE_SIZE, "danger");
        }
      }
    });
  };

  /**
   * @method selectProfileImage
   * @description for profile image permission
   */
  selectProfileImage = () => {
    if (Platform.OS === "ios") {
      Permissions.checkMultiple(["camera", "photo"]).then(response => {
        if (response.camera != "authorized" || response.photo != "authorized") {
          Toast.showToast(LABELS.CAMERA_PERMISSION, "danger");
          Permissions.openSettings();
        } else {
          this.openProfileImageChooser();
        }
      });
    } else {
      Permissions.checkMultiple(["camera", "storage"]).then(response => {
        if (
          response.camera != "authorized" ||
          response.storage != "authorized"
        ) {
          PermissionsAndroid.requestMultiple(
            [
              PermissionsAndroid.PERMISSIONS.CAMERA,
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ],
            {
              title: LABELS.PROJECT_NAME,
              message: LABELS.PERMISSION
            }
          ).then(permRes => {
            if (
              permRes["android.permission.CAMERA"] ===
                PermissionsAndroid.RESULTS.GRANTED &&
              permRes["android.permission.READ_EXTERNAL_STORAGE"] ===
                PermissionsAndroid.RESULTS.GRANTED &&
              permRes["android.permission.WRITE_EXTERNAL_STORAGE"] ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
              this.openProfileImageChooser();
            }
          });
        } else {
          this.openProfileImageChooser();
        }
      });
    }
  };

  loadFallback = () => {
    this.setState({
      errorImage: require("../../../assets/images/default_profile.png")
    });
  };

  /**
   * @method render
   * @description used to render screen
   */
  render() {
    const {
      name,
      dob,
      profilePhoto,
      errorImage,
      showLoader,
      isProfileCreated,
      sex,
      isSubmitted,
      newDate
    } = this.state;

    return (
      <Container>
        <Loader isLoading={showLoader} />
        <StatusBar
          backgroundColor="rgba(255, 255, 255, 0)"
          barStyle="dark-content"
          hidden={false}
        />
        <HeaderContent
          title={LABELS.YOUR_PROFIE}
          subTitle={LABELS.PROFILE_SUBTITLE}
          blackTheme
          showProfileSection={false}
        />
        <Content>
          <View style={innerStyle.LoginWrapper}>
            {profilePhoto == "" && (
              <TouchableOpacity
                onPress={() => this.selectProfileImage()}
                style={{ height: 60, width: "65%", backgroundColor: "#D6F2F9" }}
              >
                <Text
                  style={{
                    color: "#000",
                    textAlign: "center",
                    marginTop: 18,
                    fontWeight: "bold"
                  }}
                >
                  {LABELS.UPLOAD_PROFILE_PIC}
                </Text>
              </TouchableOpacity>
            )}
            {profilePhoto !== "" && (
              <View>
                <Image
                  source={errorImage == "" ? { uri: profilePhoto } : errorImage}
                  onError={() => this.loadFallback()}
                  style={{
                    width: 160,
                    height: 160,
                    left: 20,
                    marginBottom: 5,
                    marginLeft: 25,
                    borderRadius: 80,
                    borderWidth: 1,
                    borderColor: "#C9D2DB"
                  }}
                />
                <View style={{ position: "absolute", left: 150, bottom: 0 }}>
                  <TouchableOpacity onPress={() => this.selectProfileImage()}>
                    <Image
                      style={innerStyle.cameraimage}
                      onError={() => this.loadFallback()}
                      source={require("../../../assets/images/cameraimage.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={{ marginTop: 20 }}>
              <View>
                <InputBox
                  label={LABELS.NAME_LABEL}
                  mandatory
                  isDisabled={false}
                  maxLength={70}
                  onChangeText={this.onInputValueChanged("name")}
                  IconSize={18}
                  value={name}
                  isFieldInError={this.isFieldInError("name")}
                  fieldErrorMessage={this.getErrorsInField("name")}
                />
              </View>
              <View>
                <DatePickerInput
                  date={dob}
                  mode="date"
                  mandatory="true"
                  placeholder={LABELS.DOB_SELECT}
                  format={DATE_FORMAT}
                  label={LABELS.DOB_SELECT}
                  maxDate={newDate}
                  onDateChange={this.onInputValueChanged("dob")}
                  isFieldInError={this.isFieldInError("dob")}
                  fieldErrorMessage={this.getErrorsInField("dob")}
                />
              </View>
              <View>
                <RadioForm formHorizontal animation>
                  {this.renderRadioButtons()}
                </RadioForm>
                {/* {isSubmitted && sex === '' && (
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: 'red',
                                            marginTop: 5,
                                            fontFamily: fontSemiBold
                                        }}
                                    >
                                        {MESSAGES.REQUIRED_MESSAGE}
                                    </Text>
                                )} */}
              </View>
              <View>
                {isProfileCreated && (
                  <Button
                    title={LABELS.UPDATE_PROFILE}
                    onPress={() => this.onPressProfileButton("Invitations")}
                  />
                )}
                {isProfileCreated === false && (
                  <Button
                    title={LABELS.FIND_TRUSTED_RETAILERS}
                    onPress={() => this.onPressProfileButton("Invitations")}
                  />
                )}
                {isProfileCreated === false && (
                  <Button
                    title={LABELS.ENTER_CLOTHING_SIZES}
                    onPress={() => this.onPressProfileButton("UserProfile")}
                  />
                )}
              </View>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const innerStyle = StyleSheet.create({
  LoginWrapper: {
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%"
  },
  cameraimage: {
    height: 40,
    width: 40,
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#000000"
  },
  cameraimagewrap: {
    position: "absolute",
    bottom: 5,
    right: 5
  }
});

/**
 * @method mapStateToProps
 * @description return state to component as props
 * @param {*} state
 */
function mapStateToProps({ auth, profile }) {
  const { error } = auth;
  const { loading, userProfile } = profile;
  return { error, loading, userProfile };
}

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 */
export default connect(mapStateToProps, {
  getUserProfileAction,
  updateUserProfileAction,
  UpdateShoppingStatusAction
})(BasicProfile);
