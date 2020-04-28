import React from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Platform,
  StatusBar
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { Container } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import {
  ValidationComponent,
  locationPermissionModalOne
} from "../../../helper";
import { HeaderContent, Loader, Text, NoContentFound } from "../../common";
import InvitationTile from "./InvitationTile";
import { LABELS } from "../../../languageConstants";
import {
  getInvitationListAction,
  loaderShowHide,
  clearFilterRequestData
} from "../../../actions/Invitations";
import { getSystemConfigAction } from "../../../actions/Profile";
import { getAcceptedRetailersListAction } from "../../../actions/Retailers";
import { DEFAULT_RADIUS } from "../../../config";

class Invitations extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      refreshing: false
    };
  }

  /**
   * @method getInvitationData
   * @description to get the  invitation list data
   */
  getInvitationData = () => {
    if (Object.keys(this.props.invitationFilterRequestData).length === 0) {
      this.props.getSystemConfigAction(() => {
        this.getinvitationList();
      });
    } else {
      this.props.clearFilterRequestData();
    }
  };

  /**
   * @method getinvitationList
   * @description to call the invitation api
   */
  getinvitationList = async () => {
    const configSetting = await AsyncStorage.getItem("configSetting");
    const setting = configSetting != null ? JSON.parse(configSetting) : {};
    const { SearchRadius } = setting;
    this.props.loaderShowHide(true);
    locationPermissionModalOne(data => {
      if (data !== false) {
        const requestData = {
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
        this.props.getInvitationListAction(requestData, false, response => {
          this.props.getAcceptedRetailersListAction(
            requestData,
            false,
            responseRetailer => {}
          );
        });
      } else {
        this.props.loaderShowHide(false);
      }
    });
  };

  /**
   * @method onRefresh
   * @description to activate pull to refresh
   */
  onRefresh = async () => {
    const configSetting = await AsyncStorage.getItem("configSetting");
    const setting = configSetting != null ? JSON.parse(configSetting) : {};
    const { SearchRadius } = setting;
    this.setState({ refreshing: true }, () => {
      locationPermissionModalOne(data => {
        if (data !== false) {
          const requestData = {
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
          this.props.getInvitationListAction(requestData, true, response => {
            this.setState({ refreshing: false });
          });
        } else {
          this.setState({ refreshing: false });
        }
      });
    });
  };

  /**
   * @method renderList
   * @description used to call to render the list in flatlist by pagination
   */
  renderList = () => {
    const { invitationListing } = this.props;
    return (
      <FlatList
        data={invitationListing}
        renderItem={this.renderTileRow}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => {
          if (!this.props.invitationLoading) {
            return (
              <NoContentFound
                customHeigth={100}
                customWidth={100}
                title={LABELS.NO_INVITATIONS}
              />
            );
          }
          return null;
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            tintColor="#000"
            titleColor="#000"
            colors={["#F8D23A", "#88CE47", "#F7657C"]}
          />
        }
      />
    );
  };

  /**
   * @method sortStoresByDistance
   * @description fun for sort the data in ascending distance of store
   */
  sortStoresByDistance = (a, b) => {
    const distanceA = a.distance;
    const distanceB = b.distance;

    let comparison = 0;
    if (distanceA > distanceB) {
      comparison = 1;
    } else if (distanceA < distanceB) {
      comparison = -1;
    }
    return comparison;
  };

  /**
   * @method renderTileRow
   * @description called in render list in card section
   */
  renderTileRow = ({ item }) => {
    // if (item.retailStore.stores.sort(this.sortStoresByDistance)) {
      return (
        <InvitationTile
          retailerInformation={item}
          hideRetailer
          image={require("../../../assets/images/VectorImage.png")}
          linkText={LABELS.HIDE_RETAILER}
          linkRoute={"AcceptingInvitation"}
          screenCallBackRoute={"Invitations"}
          navigation={this.props.navigation}
        />
      );
    //}
  };

  /**
   * @method render
   * @description to render component
   */
  render() {
    return (
      <Container>
        <StatusBar
          backgroundColor="rgba(255, 255, 255, 0)"
          barStyle="dark-content"
          hidden={false}
        />
        <NavigationEvents onDidFocus={() => this.getInvitationData()} />
        <Loader
          isLoading={this.props.invitationLoading || this.props.loading}
        />
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
        <Text style={innerStyle.titleText}>{LABELS.INVITATION_HEADING}</Text>
        <View
          style={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 170,
          }}
        >
          {this.renderList()}
        </View>
      </Container>
    );
  }
}

/**
 * @method mapStateToProps
 * @description return state to component as props
 * @param {*} state
 */
const mapStateToProps = ({ invitations, retailers, profile }) => {
  const { acceptedRetailerListing } = retailers;
  const {
    invitationListing,
    invitationLoading,
    invitationFilterRequestData
  } = invitations;
  const { loading } = profile;
  return {
    invitationListing,
    invitationLoading,
    invitationFilterRequestData,
    acceptedRetailerListing,
    loading
  };
};

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 * @param {*} object
 */
export default connect(mapStateToProps, {
  getInvitationListAction,
  getAcceptedRetailersListAction,
  getSystemConfigAction,
  loaderShowHide,
  clearFilterRequestData
})(Invitations);

const innerStyle = StyleSheet.create({
  titleText: {
    color: "#000000",
    marginTop: Platform.OS === "ios" ? 15 : 5,
    fontSize: 26,
    marginLeft: 10,
    marginBottom: 5,
    fontFamily: fontBoldItalic,
  }
});
