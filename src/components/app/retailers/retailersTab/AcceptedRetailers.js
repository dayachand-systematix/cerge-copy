import React, { Component } from "react";
import { Container } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import { FlatList, View, RefreshControl } from "react-native";
import { connect } from "react-redux";
import InvitationTile from "../../invitations/InvitationTile";
import { NoContentFound } from "../../../common";
import { LABELS } from "../../../../languageConstants";
import { locationPermissionModalOne } from "../../../../helper";
import {
  getAcceptedRetailersListAction,
  setSelectedTabAction
} from "../../../../actions/Retailers";
import { DEFAULT_RADIUS } from "../../../../config";

class AcceptedRetailers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedTab != this.props.selectedTab &&
      nextProps.selectedTab == "RemovedRetailers"
    ) {
      this.props.setSelectedTabAction("AcceptedRetailers");
      this.props.navigation.navigate("RemovedRetailers");
    }
  }

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
          const requestedData = {
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
          this.props.getAcceptedRetailersListAction(
            requestedData,
            true,
            response => {
              this.setState({ refreshing: false });
            }
          );
        } else {
          this.setState({ refreshing: false });
        }
      });
    });
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
   * @method renderList
   * @description used to call to render the list in flatlist by pagination
   */
  renderList = () => {
    const { acceptedRetailerListing } = this.props;
    if (acceptedRetailerListing && Array.isArray(acceptedRetailerListing)) {
      console.log("acceptedRetailerListing", acceptedRetailerListing);
      return (
        <FlatList
          data={acceptedRetailerListing}
          renderItem={this.renderTileRow}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => {
            if (!this.props.retailerLoading) {
              return (
                <NoContentFound
                  customHeigth={100}
                  customWidth={100}
                  title={LABELS.NO_RETAILERS}
                />
              );
            }
            return null;
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              tintColor="#000"
              titleColor="#000"
              colors={["#F8D23A", "#88CE47", "#F7657C"]}
            />
          }
        />
      );
    }
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
          screenNavigation
          image={require("../../../../assets/images/VectorImage.png")}
          linkText={LABELS.LOYALTY_LABEL}
          linkRoute={"InvitationsDetail"}
          screenCallBackRoute={"RemovedRetailers"}
          navigation={this.props.navigation}
        />
      );
    //}
  };

  render() {
    return (
      <Container>
        <View style={{ margin: 5, paddingBottom: 0 }}>{this.renderList()}</View>
      </Container>
    );
  }
}

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 */
const mapStateToProps = ({ retailers }) => {
  const { acceptedRetailerListing, retailerLoading, selectedTab } = retailers;
  return { acceptedRetailerListing, retailerLoading, selectedTab };
};

export default connect(mapStateToProps, {
  getAcceptedRetailersListAction,
  setSelectedTabAction
})(AcceptedRetailers);
