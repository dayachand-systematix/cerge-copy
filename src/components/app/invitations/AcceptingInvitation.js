import React from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  Image,
  Linking,
  TouchableOpacity,
  NativeModules
} from "react-native";
import moment from 'moment';
import { Container, Content, Icon, Input as InputText } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import { LABELS } from "../../../languageConstants";
import DetailTile from "./DetailTile";
import styles from "../../../assets/styles";
import {
  HeaderContent,
  LineText,
  Cards,
  Button,
  Loader,
  Text,
    LabelComponent
} from "../../common";
import {
  getInvitationDetail,
  acceptInvitationAction,
  getInvitationListAction
} from "../../../actions/Invitations";
import {
  getAcceptedRetailersListAction,
  hideAcceptedAction
} from "../../../actions/Retailers";
import { DEFAULT_RADIUS, MESSAGES, STATUS_CODES } from "../../../config";
import {
  locationPermissionModalOne,
  locationPermissionModalForAuth,
  Toast,
  ValidationComponent
} from "../../../helper";
import {
  pingClosestStoreAction, enterStoreAction,
  leaveStoreAction
} from '../../../actions/Common';
import { getUrlFromString } from "../../../helper/index";

const GeoLocationData = NativeModules.GeoLocation;

class AcceptingInvitation extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      loyaltyNumber: "",
        loyaltyInput: "",
      invitationItems: [],
      retailer: {},
      stores: [],
      invitationId: "",
      loyaltyURL: "",
      dataPrivacyURL: "",
      infoArray: [],
      screenCallBackRoute: "",
      displayInvitationList: [],
    };
  }

  componentDidMount() {
    const {
      retailStore: { retailer, stores },
      invitationId,
      screenCallBackRoute,
      loyaltyNumber
    } = this.props.navigation.getParam("retailerDetails");
    this.props.getInvitationDetail(invitationId);
    this.setState({
      retailer,
      stores,
      invitationId,
      screenCallBackRoute,
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
        let loyaltyURLTrigger = "";
        let dataPrivacyTrigger = "";

        invitationItems.map(item => {
          if (
            item.name === "Enter URL to your data privacy policy" &&
            item.value === "1" &&
            item.info &&
            item.info != null &&
            item.info != ""
          ) {
            dataPrivacyTrigger = item.info;
            tempItemArray.push(item);
          } else if (
            item.name === "Bonus Loyalty Points" &&
            item.value === "1" &&
            item.info &&
            item.info != null &&
            item.info != ""
          ) {
            loyaltyURLTrigger = item.info;
            tempItemArray.push(item);
          } else if (item.value === "1") {
            tempItemArray.push(item);
          }
        });
        this.setState({
          invitationItems: tempItemArray,
          loyaltyURL: loyaltyURLTrigger,
          dataPrivacyURL: dataPrivacyTrigger
        });
      }
      console.log('nextProps.invitationDetail.displayList',nextProps.invitationDetail.displayList)
      if (nextProps.invitationDetail.displayList && nextProps.invitationDetail.displayList.length > 0) {
        this.setState({ displayInvitationList: nextProps.invitationDetail.displayList });
      }
    }
  }

  /**
  * @method enterInStore
  * @description calling in-store API to enter the shooper in shop
  */
  enterInStore = storeData => {
    const requestData = {
      storeId: storeData.storeId
    };
    this.props.enterStoreAction(requestData, res => {
      if (
        res &&
        res.code &&
        res.code == STATUS_CODES.OK
      ) {
        AsyncStorage.setItem('defaultTime', '60000');
        AsyncStorage.setItem('HID', res.data.toString());
        const data = {
          storeId: storeData.storeId,
          time: moment().format(),
          outCount: 1
        };
        AsyncStorage.setItem('nearStoreData', JSON.stringify(data));
      }
    });
  };

  /**
  * @method leaveStore
  * @description calling leave store API to forcefully leave out the store
  */
  leaveStore = async (pingResponse, callback) => {
    let nearStoreData = await AsyncStorage.getItem('nearStoreData');
    nearStoreData = nearStoreData != null ? JSON.parse(nearStoreData) : "";
    const HID = await AsyncStorage.getItem('HID');
    if (nearStoreData && nearStoreData != null && nearStoreData != '' && HID && HID != null && HID != '') {
      if (pingResponse.closestStore && pingResponse.closestStore.retailStore && pingResponse.closestStore.retailStore.store && pingResponse.closestStore.retailStore.store.storeId !== nearStoreData.storeId) {
        const requestData = {
          storeId: nearStoreData.storeId,
          shoppingHistoryId: HID
        };
        this.props.leaveStoreAction(requestData, res => {
          if (res && res.code && res.code == STATUS_CODES.OK) {
            AsyncStorage.setItem('defaultTime', '');
            AsyncStorage.setItem('HID', '');
            AsyncStorage.setItem('nearStoreData', '');
          }
          callback(true);
        });
      } else {
        callback(false);
      }
    } else {
      callback(true);
    }
  };

  async restartTracking() {
    const auth_token = await AsyncStorage.getItem("auth_token");
    GeoLocationData.restartService(auth_token);
  }

  /**
   * @method acceptInvitation
   * @description to accept the invitation
   */
  acceptInvitation = async () => {
    const configSetting = await AsyncStorage.getItem("configSetting");
    const setting = configSetting != null ? JSON.parse(configSetting) : {};
    const { SearchRadius } = setting;
    const {
      retailer: { retailerId },
      invitationId,
      loyaltyURL,
        loyaltyInput
    } = this.state;
    const requestData = {
      retailerId,
      invitationId,
        loyaltyNumber: loyaltyInput,
      loader: true
    };
    this.props.acceptInvitationAction(requestData, response => {
      this.props.hideAcceptedAction(requestData);
      if (
        response &&
        response.data &&
        response.data.code &&
        response.data.code == STATUS_CODES.OK
      ) {
        if (loyaltyURL !== "") {
          locationPermissionModalOne(data => {
            if (data !== false) {
              const requestedData = {
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
              this.props.getInvitationListAction(
                requestedData,
                true,
                responseData => {
                  this.props.getAcceptedRetailersListAction(
                    requestedData,
                    false,
                    responseRetailer => {
                      this.restartTracking();
                      this.props.navigation.navigate("InvitationAccept", {
                        retailerDetails: this.props.navigation.getParam(
                          "retailerDetails"
                        ),
                        loyaltyURL
                      });
                    }
                  );
                }
              );
            }
          });
        } else {
          locationPermissionModalOne(data => {
            if (data !== false) {
              const requestedData = {
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
              this.props.getInvitationListAction(
                requestedData,
                true,
                responseData => {
                  this.props.getAcceptedRetailersListAction(
                    requestedData,
                    false,
                    responseRetailer => {
                      this.restartTracking();
                      if (
                        this.state.screenCallBackRoute &&
                        this.state.screenCallBackRoute !== undefined &&
                        this.state.screenCallBackRoute == "Retailers"
                      ) {
                        Toast.showToast(
                          MESSAGES.RETAILER_ACCEPT_SUCCESS,
                          "success"
                        );
                        this.props.navigation.navigate("Retailers");
                      } else {
                        Toast.showToast(
                          MESSAGES.INVITATION_ACCEPT_SUCCESS,
                          "success"
                        );
                        this.props.navigation.navigate("Invitations");
                      }
                    }
                  );
                }
              );
            }
          });
        }
      } else {
        Toast.showToast(MESSAGES.SOME_ERROR, "danger");
      }
    });
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
    const {
      retailer,
      stores,
      invitationItems,
      dataPrivacyURL,
      infoArray,
      loyaltyNumber,
        loyaltyInput,
      displayInvitationList
    } = this.state;
    const { invitationLoading, retailerLoading, loading } = this.props;

      let inputImageWarpper = innerStyle.inputImageWarpper;
      let placeHolderTextColor = "rgba(0, 0, 0, 0.5)";

    return (
      <Container style={innerStyle.container}>
        <Loader isLoading={invitationLoading || retailerLoading || loading} />
        <HeaderContent
          title={LABELS.USERNAME}
          subTitle={LABELS.INVITATION_SUBTITLE}
          linkExist
          linkText={LABELS.INVITATION_LINK_TEXT}
          linkNavigation="InvitationsFilter"
          blackTheme
          showProfileSection
          showBugReport

        />
        <Content style={{ marginBottom: 20 }}>
          <View style={{ top: 20 }}>
            <View style={[innerStyle.innerSection]}>
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
                loyaltyNumber={"N/A"}
              />

              <View style={{ marginBottom: 10}}>
                <Button
                    title={LABELS.ACCEPT_INVITATION}
                    onPress={this.acceptInvitation}
                >
                    {LABELS.ACCEPT_INVITATION}
                </Button>
              </View>

              {displayInvitationList && Array.isArray(displayInvitationList) && displayInvitationList.length > 0 &&
                displayInvitationList.map((item, index) => {
                  if (index === 0) {
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
                })}

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
                        value={loyaltyInput}
                        keyboardType={'default'}
                        onChangeText={(val)=>this.setState({loyaltyInput: val})}
                        maxLength={26}
                        disabled={false}
                        autoCapitalize={'sentences'}
                        underlineColorAndroid="transparent"
                    />
                  </View>
                </View>
              </View>

              {/*<View
                style={{
                  paddingLeft: 10,
                  paddingTop: 20,
                  marginRight: 10,
                  alignItems: "flex-start",
                  flexDirection: "row"
                }}
              >
                <View style={[styles.w75]}>
                  <Text>
                    <Text
                      style={{
                        color: "black",
                        fontSize: 16,
                        fontWeight: "bold"
                      }}
                    >
                      {LABELS.INFO}
                    </Text>
                    <Text style={{ color: "#000000", opacity: 1 }}>
                      {LABELS.INFO_DESC}
                    </Text>
                  </Text>
                </View>
                <View style={[styles.w25, { right: 3 }]}>
                  <Image
                    source={require("../../../assets/images/CergeDataBank.png")}
                    style={{
                      width: 100,
                      height: 55
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  paddingLeft: 10,
                  paddingBottom: 30,
                  marginRight: 10
                }}
              >
                {dataPrivacyURL != "" && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(dataPrivacyURL)}
                  >
                    <Text
                      style={{
                        paddingTop: 20,
                        color: "#4915f0",
                        textDecorationLine: "underline"
                      }}
                    >
                      {LABELS.DATA_PRIVACY_TEXT}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>*/}

            </View>
          </View>
        </Content>
      </Container>
    );
  }
}
const mapStateToProps = ({ invitations, retailers, common }) => {
  const { invitationDetail, invitationLoading } = invitations;
  const { retailerLoading } = retailers;
  const { loading } = common;
  return { invitationDetail, invitationLoading, retailerLoading, loading };
};

export default connect(mapStateToProps, {
  getInvitationDetail,
  acceptInvitationAction,
  getAcceptedRetailersListAction,
  getInvitationListAction,
  hideAcceptedAction,
  pingClosestStoreAction,
  enterStoreAction,
  leaveStoreAction
})(AcceptingInvitation);

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
    paddingBottom: 20,
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
});
