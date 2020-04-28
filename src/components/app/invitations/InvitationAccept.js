import React from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Keyboard
} from "react-native";
import { Container, Content, Input as InputText } from "native-base";
import { LABELS } from "../../../languageConstants";
import styles from "../../../assets/styles";
import { ValidationComponent, Toast } from "../../../helper";
import { Text, Button, HeaderContent, LabelComponent } from "../../common";
import { STATUS_CODES, MESSAGES, API } from "../../../config";
import { updateLoyaltyNumberAction } from "../../../actions/Retailers";

class InvitationAccept extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      loyaltyNumber: "",
      retailer: "",
      isSubmitted: false,
      invitationItems: [],
      loyaltyURL: ""
    };
  }

  componentDidMount() {
    const {
      retailStore: { retailer }
    } = this.props.navigation.getParam("retailerDetails");
    const loyaltyURL = this.props.navigation.getParam("loyaltyURL");
    this.setState({
      retailer,
      loyaltyURL
    });
  }

  /**
   * @method checkValidation
   * @description called to check validations
   */
  checkValidation = () => {
    /* Call ValidationComponent validate method */
    this.validate({
      loyaltyNumber: {
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

  /**
   * @method onPressLoyaltySubmit
   * @description to submit the loyalty point
   */
  onPressLoyaltySubmit = () => {
    Keyboard.dismiss();
    this.setState({ isSubmitted: true });
    this.checkValidation();
    const {
      retailer: { retailerId },
      loyaltyNumber
    } = this.state;
    if (loyaltyNumber != null && loyaltyNumber != undefined && loyaltyNumber != "") {
      const requestData = {
        retailerId,
        loyaltyNumber
      };
      this.props.updateLoyaltyNumberAction(requestData, response => {
        if (
          response &&
          response.data &&
          response.data.code &&
          response.data.code == STATUS_CODES.OK
        ) {
          Toast.showToast(MESSAGES.LOYALTY_UPDATE_SUCCESS, "success");
          this.props.navigation.navigate("Invitations");
        }
      });
    }
  };

  /**
   * @method onPressNOButton
   * @description to navigate to invitation screen
   */
  onPressNOButton = () => {
    this.props.navigation.navigate("Invitations");
  };

  /**
   * @method onPressYesButton
   * @description to open the loyalty url
   */
  onPressYesButton = () => {
    const { loyaltyURL } = this.state;
    if (loyaltyURL && loyaltyURL !== undefined && loyaltyURL != "") {
      Linking.openURL(loyaltyURL);
    } else {
      Toast.showToast(MESSAGES.INCORRECT_URL, "warning");
    }
  };

  /**
   * @method render
   * @description to render component
   */
  render() {
    /* INput data start */
    const customWords = "sentences";
    const keyboardType = "default";
    /* Input data ends */
    const { retailer, loyaltyNumber, isSubmitted } = this.state;
    let inputImageWarpper = innerStyle.inputImageWarpper;
    let placeHolderTextColor = "rgba(0, 0, 0, 0.5)";
    if (isSubmitted && (loyaltyNumber == null || loyaltyNumber == undefined || loyaltyNumber == "")) {
      inputImageWarpper = [
        innerStyle.inputImageWarpper,
        { borderBottomColor: "red" }
      ];
      placeHolderTextColor = "rgba(242, 38, 19, 0.5)";
    }
    return (
      <Container style={innerStyle.container}>
        <HeaderContent
          title={LABELS.USERNAME}
          subTitle={LABELS.INVITATION_ACCEPT_SUBTITLE}
          blackTheme={false}
          showProfileSection={false}
          showBugReport
        />
        <Content>
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Invitations")}
              style={{ flex: 1, flexDirection: "row-reverse" }}
            >
              <Image
                source={require("../../../assets/images/Cancle.png")}
                style={{
                  width: 40,
                  height: 40,
                  left: 20,
                  marginBottom: 10
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, flexDirection: "row" }}>
              <Image
                source={{
                  uri: `${API.DownloadImage}?key=${retailer.businessLogo}`
                }}
                style={{
                  width: 120,
                  height: 90
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingLeft: 10,
              paddingBottom: 30,
              paddingTop: 20,
              marginRight: 10
            }}
          >
            <View stackedLabel style={[innerStyle.itemWarpper]}>
              <LabelComponent
                label={LABELS.LOYALTY_LABEL}
                mandatory={false}
                blackTheme
              />
              <View style={inputImageWarpper}>
                <InputText
                  style={innerStyle.textStyle}
                  secureTextEntry={false}
                  placeholder="xxxx xxxx"
                  placeholderTextColor={placeHolderTextColor}
                  autoCorrect={false}
                  value={loyaltyNumber}
                  keyboardType={keyboardType}
                  onChangeText={this.onInputValueChanged("loyaltyNumber")}
                  maxLength={26}
                  disabled={false}
                  autoCapitalize={customWords}
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity onPress={this.onPressLoyaltySubmit}>
                  <Image
                    source={require("../../../assets/images/Group.png")}
                    style={innerStyle.Image}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <Text style={innerStyle.text}>{LABELS.OR}</Text>
            <Text style={innerStyle.titleText}>
              {`${LABELS.LOYALTY_SIGNUP_TEXTINITIAL} ${retailer.businessName} ${LABELS.LOYALTY_SIGNUP_TEXTFINISH}`}
            </Text>
          </View>
          <View style={[styles.flexOne, innerStyle.mainPWwrap]}>
            <View
              style={[
                styles.gridRows,
                marginTop.Five,
                paddingLeft.Ten,
                paddingRight.Ten,
                styles.verticalCenter
              ]}
            />
            <Button
              title={LABELS.YES_SIGNUP}
              onPress={() => this.onPressYesButton()}
            />
            <Button
              title={LABELS.NO_THANKS}
              onPress={() => this.onPressNOButton()}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

/**
 * @method mapStateToProps
 * @description return state to component as props
 * @param {*} state
 */
const mapStateToProps = ({ invitations }) => {
  const { invitationDetail } = invitations;
  return { invitationDetail };
};

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 * @param {*} object
 */
export default connect(mapStateToProps, { updateLoyaltyNumberAction })(
  InvitationAccept
);

const innerStyle = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    opacity: 1
  },
  text: {
    textAlign: "left",
    letterSpacing: 1.35,
    color: "#FFFFFF",
    left: 10,
    fontSize: 19
  },
  mainPWwrap: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15
  },
  titleText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontFamily: fontBoldItalic,
    fontSize: 24,
    marginLeft: 10
  },
  flex: {
    flex: 1
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  headingContainer: {
    paddingBottom: 30
  },
  card: {
    width: "85%",
    marginBottom: 20,
    backgroundColor: "#000000"
  },
  itemWarpper: {
    marginLeft: 0,
    marginBottom: 15
  },
  inputImageWarpper: {
    flexDirection: "row",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    marginBottom: 15,
    marginTop: 20,
    backgroundColor: "#FFFFFF"
  },
  textStyle: {
    fontSize: 15,
    color: "#000000",
    fontFamily: fontRegular,
    marginBottom: 0,
    textAlignVertical: "top",
    paddingLeft: 0
  },
  Image: {
    width: 50,
    height: 50
  }
});
