import React, { PureComponent } from "react";
import { View, StyleSheet, Image, TouchableOpacity, NativeModules } from "react-native";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import { Text, ArrowButton, LabelBox } from "../../common";
import { LABELS } from "../../../languageConstants";
import {
  Toast,
  locationPermissionModalOne,
  displayDistance
} from "../../../helper";
import {
  getRejectedRetailersListAction,
  getAcceptedRetailersListAction,
  hideAcceptedAction
} from "../../../actions/Retailers";
import {
  rejectInvitationAction,
  acceptInvitationAction,
  getInvitationListAction,
  tempRetailerAPIAction,
  hideInvitationAction
} from "../../../actions/Invitations";
import { MESSAGES, STATUS_CODES, DEFAULT_RADIUS, API } from "../../../config";
import NavigationService from "../../../services/navigator";

const GeoLocationData = NativeModules.GeoLocation;

class InvitationTile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorImage: "",
      loading: false
    };
  }

  async restartTracking() {
    const auth_token = await AsyncStorage.getItem("auth_token");
    GeoLocationData.restartService(auth_token);
  }

  /**
   * @method onPressHideRetailer
   * @description navigation on props screen
   */
  onPressHideRetailer = async () => {
    const configSetting = await AsyncStorage.getItem("configSetting");
    const setting = configSetting != null ? JSON.parse(configSetting) : {};
    const { SearchRadius } = setting;

    const {
      acceptRetailer,
      hideRetailer,
      retailerInformation,
      screenNavigation,
      linkRoute
    } = this.props;

    /* Data for reject or accept invitation */
    const requestData = {
      retailerId: retailerInformation.retailStore.retailer.retailerId,
      invitationId: retailerInformation.invitationId
    };

    /* Data for getting new invitations */
    locationPermissionModalOne(data => {
      if (data !== false) {
        const getInvitationRequestData = {
          radius:
            SearchRadius && SearchRadius != null && SearchRadius !== undefined
              ? SearchRadius
              : DEFAULT_RADIUS,
          location: {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            altitude: data.coords.altitude
          }
        };
        /* Hide invitation and call getInvitation API */
        if (hideRetailer !== undefined && hideRetailer) {
          this.props.rejectInvitationAction(requestData, response => {
            if (
              response &&
              response.data &&
              response.data.code &&
              response.data.code == STATUS_CODES.OK
            ) {
              this.props.getRejectedRetailersListAction(
                getInvitationRequestData,
                false,
                getResponse => {
                  if (
                    getResponse &&
                    getResponse.data &&
                    getResponse.data.code &&
                    getResponse.data.code == STATUS_CODES.OK
                  ) {
                    this.props.hideInvitationAction(requestData);
                    Toast.showToast(
                      MESSAGES.INVITATION_REJECT_SUCCESS,
                      "success"
                    );
                  }
                }
              );
            }
          });
        }
        /* accept invitation and call getInvitation API */
        if (acceptRetailer !== undefined && acceptRetailer) {
          this.props.acceptInvitationAction(requestData, response => {
            if (
              response &&
              response.data &&
              response.data.code &&
              response.data.code == STATUS_CODES.OK
            ) {
              this.restartTracking();
              this.props.getAcceptedRetailersListAction(
                getInvitationRequestData,
                false,
                getResponse => {
                  if (
                    getResponse &&
                    getResponse.data &&
                    getResponse.data.code &&
                    getResponse.data.code == STATUS_CODES.OK
                  ) {
                    this.props.hideAcceptedAction(requestData);
                    this.props.hideInvitationAction(requestData);
                    Toast.showToast(
                      MESSAGES.INVITATION_ACCEPT_SUCCESS,
                      "success"
                    );
                  }
                }
              );
            }
          });
        }

        /* Navigation for the screen */
        if (screenNavigation !== undefined && screenNavigation) {
          NavigationService.navigate(linkRoute, {
            retailerDetails: retailerInformation
          });
        }
      }
    });
  };

  /**
   * @method loadFallback
   * @description used to set the no image if data is empty
   */
  loadFallback = () => {
    this.setState({
      errorImage: require("../../../assets/images/noimage.png")
    });
  };

  /**
   * @method loadFallback
   * @description used to set the no image if data is empty
   */
  displayStoreName = () => {
    const { retailerInformation } = this.props;
    if (
      retailerInformation &&
      retailerInformation.retailStore &&
      retailerInformation.retailStore.stores.length > 0 &&
      retailerInformation.retailStore.stores[0].storeInfo
    ) {
      return retailerInformation.retailStore.stores[0].storeInfo.storeName;
    } else {
      return "N/A";
    }
  };

    routeArrow = () => {
        const { retailerInformation, linkRoute } = this.props;


        console.log('retailerInformation',linkRoute, retailerInformation)
        NavigationService.navigate(linkRoute, {
            retailerDetails: retailerInformation
        });

        // if (retailerInformation !== undefined && retailerInformation) {
        //     NavigationService.navigate(linkRoute, {
        //         retailerInformation
        //     });
        // } else {
        //     this.props.navigation.navigate(linkRoute);
        // }
    };
  /**
   * @method render
   * @description used to render the tile
   */
  render() {
    const {
      linkText,
      linkRoute,
      retailerInformation,
      screenCallBackRoute
    } = this.props;
    const { errorImage } = this.state;
    let sourceImage;
    if (
      retailerInformation &&
      retailerInformation.retailStore &&
      retailerInformation.retailStore.retailer &&
      retailerInformation.retailStore.retailer.businessLogo !== ""
    ) {
      let profilePhotoData =
        retailerInformation.retailStore.retailer.businessLogo;
      sourceImage = { uri: API.DownloadImage + "?key=" + profilePhotoData };
    } else {
      sourceImage = require("../../../assets/images/noimage.png");
    }
    const { distance } =
      retailerInformation && retailerInformation.retailStore
        ? retailerInformation.retailStore.stores[0]
        : 0;
    if (screenCallBackRoute && screenCallBackRoute !== undefined) {
      retailerInformation.screenCallBackRoute = screenCallBackRoute;
    }
    console.log('loyaltydddd', retailerInformation.loyaltyNumber)
    return (
      <View style={innerStyle.invitationBox}>
        <View style={{ flexDirection: "row" }}>
          <View style={innerStyle.storeName}>
            <Text>{this.displayStoreName()}</Text>
          </View>
          <View style={innerStyle.meterDistance}>
            <View>
              <Image
                source={require("../../../assets/images/VectorSmart.png")}
                style={innerStyle.pinImage}
                resizeMode={"contain"}
              />
            </View>
            <View style={{ marginLeft: 5 }}>
              <Text>
                {displayDistance(distance)}
                {LABELS.METER_FROM_YOU}
              </Text>
            </View>
          </View>
        </View>
        <View style={innerStyle.invitationBottomBox}>
          <TouchableOpacity onPress={()=> this.routeArrow()} style={{ padding: 6 }}>
            <Image
              onError={() => this.loadFallback()}
              source={errorImage != "" ? errorImage : sourceImage}
              style={innerStyle.Image}
            />
          </TouchableOpacity>

          <View>
            <ArrowButton
                onPress={linkRoute}
                retailerDetails={
                    retailerInformation && retailerInformation !== undefined
                        ? retailerInformation
                        : {}
                }
            />
          </View>



          <View style={[innerStyle.ArrowButton]}>
              {((retailerInformation.loyaltyNumber == null || retailerInformation.loyaltyNumber == '') && (
                  <TouchableOpacity onPress={this.onPressHideRetailer}>
                    <Text style={innerStyle.innerLinkText}>{linkText}</Text>
                  </TouchableOpacity>
              )) || <LabelBox
                  ValColor={'#000000'}
                  labColor={'#808080'}
                  value={retailerInformation.loyaltyNumber}
                  label={LABELS.LOYALTY_NUMBER}
                  isInline={false}
                  medium
              />}
          </View>
        </View>
      </View>
    );
  }
}

/**
 * @method mapStateToProps
 * @description return state to component as props
 * @param {*} state
 */
const mapStateToProps = () => ({});

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 * @param {*} object
 */
export default connect(mapStateToProps, {
  rejectInvitationAction,
  acceptInvitationAction,
  getRejectedRetailersListAction,
  getAcceptedRetailersListAction,
  hideAcceptedAction,
  getInvitationListAction,
  tempRetailerAPIAction,
  hideInvitationAction
})(InvitationTile);

const innerStyle = StyleSheet.create({
  invitationBox: {
    backgroundColor: "#F0F0F0",
    marginBottom: 14,
    marginTop: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 3
  },
  meterDistance: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 5,
    marginRight: 5
  },
  storeName: {
    alignItems: "flex-start",
    flex: 1,
    marginLeft: 5,
    marginTop: 5
  },
  invitationBottomBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 2
  },
  Image: {
    width: 120,
    height: 90
  },
  pinImage: {
    width: 15,
    height: 18
  },
  ArrowButton: {
    padding: 6,
    //marginRight: 8,
      width: '37%',
      alignItems: 'flex-end'
  },
  text: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000"
  },
  linkBox: {
    alignSelf: "flex-start",
    marginTop: 26
  },
  innerLinkText: {
    color: "#000000",
    textDecorationLine: "underline"
  }
});
