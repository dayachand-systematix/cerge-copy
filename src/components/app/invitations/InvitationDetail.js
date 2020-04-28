import React from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Keyboard,
  NativeModules,
  Linking
} from "react-native";
import { Container, Content, Input as InputText, Icon } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import {
  getInvitationDetail,
  rejectInvitationAction
} from "../../../actions/Invitations";
import {
  getRetailersListAction,
  setSelectedTabAction,
  updateLoyaltyNumberAction
} from "../../../actions/Retailers";
import { LABELS } from "../../../languageConstants";
import DetailTile from "./DetailTile";
import {
  HeaderContent,
  LineText,
  Cards,
  LinkText,
  Text,
  LabelComponent,
  Loader
} from "../../common";
import { DEFAULT_RADIUS, MESSAGES, STATUS_CODES } from "../../../config";
import {
  locationPermissionModalOne,
  Toast,
  ValidationComponent
} from "../../../helper";
import styles from '../../../assets/styles';
import { getUrlFromString } from "../../../helper/index";

const GeoLocationData = NativeModules.GeoLocation;

class InvitationDetail extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      loyaltyNumber: "",
      invitationItems: [],
      retailer: {},
      stores: [],
      invitationId: "",
      isSubmitted: false,
      infoArray: [],
      displayInvitationList: [],
    };
  }

  componentDidMount() {
    const {
      invitationId,
      retailStore: { retailer, stores },
      loyaltyNumber
    } = this.props.navigation.getParam("retailerDetails");
    this.props.getInvitationDetail(invitationId);
    this.setState({
      invitationId,
      stores,
      retailer,
      loyaltyNumber
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.invitationDetail != nextProps.invitationDetail) {
      if (
        nextProps.invitationDetail.invitation &&
        nextProps.invitationDetail.invitation.detail &&
        nextProps.invitationDetail.invitation.detail.length > 0
      ) {
        const {
          invitationDetail: { invitation }
        } = nextProps;
        const invitationItems =
          invitation && invitation != "" ? invitation.detail : [];
        const tempItemArray = [];
        invitationItems.map(item => {
          if (item.value === "1") {
            tempItemArray.push(item);
          }
        });
        this.setState({
          invitationItems: tempItemArray
        });
      }
      if (nextProps.invitationDetail.displayList && nextProps.invitationDetail.displayList.length > 0) {
        this.setState({ displayInvitationList: nextProps.invitationDetail.displayList });
      }
    }
  }

  async restartTracking() {
    const auth_token = await AsyncStorage.getItem("auth_token");
    GeoLocationData.restartService(auth_token);
  }

  /**
   * @method onPressRemoveRetailer
   * @description used when Remove Retailer is Pressed
   */
  onPressRemoveRetailer = async () => {
    const configSetting = await AsyncStorage.getItem("configSetting");
    const setting = configSetting != null ? JSON.parse(configSetting) : {};
    const { SearchRadius } = setting;

    const {
      retailer: { retailerId },
      invitationId
    } = this.state;
    const requestData = {
      retailerId,
      invitationId
    };

    this.props.rejectInvitationAction(requestData, response => {
      if (
        response &&
        response.data &&
        response.data.code &&
        response.data.code == STATUS_CODES.OK
      ) {
        Toast.showToast(MESSAGES.INVITATION_REJECT_SUCCESS, "success");

        locationPermissionModalOne(data => {
          this.restartTracking();
          if (data !== false) {
            const requestedDataList = {
              radius:
                SearchRadius &&
                  SearchRadius != null &&
                  SearchRadius !== undefined
                  ? SearchRadius
                  : DEFAULT_RADIUS,
              location: {
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
                altitude: data.coords.altitude
              }
            };
            this.props.setSelectedTabAction("RemovedRetailers");
            this.props.getRetailersListAction(requestedDataList, response => {
              this.props.navigation.navigate("Retailers");
            });
          }
        });
      }
    });
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
   * @method onPressLoyaltySubmit
   * @description to call the API of sub,it loyalty point
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
          this.props.navigation.navigate("Retailers");
        }
      });
    }
  };

  /**
   * @method setActiveInfo
   * @description to set the active info
   */
  setActiveInfo = index => {
    const { infoArray } = this.state;
    if (!infoArray.includes(index)) {
      infoArray.push(index);
    }
    this.setState({ infoArray });
  };

  openUrl = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't open link ");
          Toast.showToast("Can't open link ", "danger");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }

  renderText = (item) => {

    const clickableUrl = getUrlFromString(item);

    if (clickableUrl && clickableUrl != '') {
      return <TouchableOpacity onPress={() => this.openUrl(clickableUrl)}>
        <LineText
          weight={"semiBold"}
          style={{
            backgroundColor: "#FFFFFF",
            color: "#778389",
            fontSize: 22,
            fontFamily: fontBoldItalic,
            paddingLeft: 20,
            opacity: 1,
            paddingTop: 20,
            paddingBottom: 20
          }}
        >
          {item}
        </LineText>
      </TouchableOpacity>
    } else {
      return <LineText
        weight={"semiBold"}
        style={{
          backgroundColor: "#FFFFFF",
          color: "#778389",
          fontSize: 22,
          fontFamily: fontBoldItalic,
          paddingLeft: 20,
          opacity: 1,
          paddingTop: 20,
          paddingBottom: 20
        }}
      >
        {item}
      </LineText>
    }


  }

  /**
   * @method render
   * @description to render component
   */
  render() {
    /* INput data start */
    const customWords = "sentences";
    const keyboardType = "default";
    /* Input data ends */

    const {
      retailer,
      stores,
      invitationItems,
      loyaltyNumber,
      isSubmitted,
      infoArray,
      displayInvitationList
    } = this.state;
    const { invitationLoading } = this.props;
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
        <Loader isLoading={invitationLoading} />
        <HeaderContent
          title={LABELS.USERNAME}
          subTitle={LABELS.ACCEPTED_RETAILERS}
          blackTheme
          showProfileSection
          showBugReport
        />
        <Content>
          <View style={{ top: 20 }}>
            <View style={[innerStyle.innerSection, { position: "relative" }]}>
              <DetailTile
                  retailerDistance={
                      stores &&
                      stores.length > 0 &&
                      stores[0].distance ? stores[0].distance : 0
                  }
                retailerImageExist
                retailerImagePath={retailer.businessLogo}
                retailerAddress={
                  stores &&
                  stores.length > 0 &&
                  `${stores[0].storeInfo.address} ${stores[0].storeInfo.suburb} ${stores[0].storeInfo.state} ${stores[0].storeInfo.country} ${stores[0].storeInfo.postcode}`
                }
                loyaltyNumber={
                  loyaltyNumber &&
                    loyaltyNumber !== undefined &&
                    loyaltyNumber !== null
                    ? loyaltyNumber
                    : "N/A"
                }
              />
              {displayInvitationList && Array.isArray(displayInvitationList) && displayInvitationList.length > 0 &&
                displayInvitationList.map((item, index) => {
                  if (index == 0) {
                    return (
                      <Cards
                        style={{ marginRight: 20, height: 174 }}
                        key={index}
                      >
                        {this.renderText(item)}
                      </Cards>
                    );
                  } else {
                    return (
                      <Cards
                        style={{ marginRight: 20, height: 174 }}
                        key={index}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            position: "absolute",
                            marginTop: -30,
                            zIndex: 99999
                          }}
                        >
                          <Image
                            source={require("../../../assets/images/add.png")}
                            style={{
                              height: 50,
                              width: 50,
                              overflow: "visible"
                            }}
                          />
                        </View>
                        {this.renderText(item)}
                      </Cards>
                    );
                  }
                })
              }
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
                    blackTheme={false}
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
                <LinkText
                  linkTextData={LABELS.REMOVE_RETAILER}
                  textColorCode={"#860D0D"}
                  linkNavigation={"Reviews"}
                  onPressLink={this.onPressRemoveRetailer}
                  props={this.props.navigation}
                />
              </View>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
const mapStateToProps = ({ invitations }) => {
  const { invitationDetail, invitationLoading } = invitations;
  return { invitationDetail, invitationLoading };
};

export default connect(mapStateToProps, {
  getInvitationDetail,
  rejectInvitationAction,
  getRetailersListAction,
  setSelectedTabAction,
  updateLoyaltyNumberAction
})(InvitationDetail);

const innerStyle = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    opacity: 1
  },
  innerSection: {
    backgroundColor: "#F0F0F0",
    marginRight: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingBottom: 20
  },
  buttonText: {
    color: "#000000",
    textAlign: "center",
    paddingLeft: 20,
    fontSize: 12,
    paddingRight: 8
  },
  nestedButtonView: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 30
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
