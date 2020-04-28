import React, { Component } from 'react';
import { Container } from 'native-base';
import { StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import RetailerTabsContainer from './retailersTab';
import { LABELS } from '../../../languageConstants';
import { HeaderContent, Loader } from '../../common';
import { getRetailersListAction } from '../../../actions/Retailers';
import { locationPermissionModalOne } from '../../../helper';
import { DEFAULT_RADIUS } from '../../../config';

class Retailers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedTab: true,
      defaultScreen: 'AcceptedRetailers'
    };
  }

  /**
   * @method getRetailerList
   * @description To call the both retailer's list
   */
  getRetailerList = async () => {
    const configSetting = await AsyncStorage.getItem('configSetting');
    const setting = configSetting != null ? JSON.parse(configSetting) : {};
    const { SearchRadius } = setting;
    locationPermissionModalOne((data) => {
      if (data !== false) {
        const requestedData = {
          radius: SearchRadius && SearchRadius != null && SearchRadius !== undefined ? SearchRadius : DEFAULT_RADIUS,
          location: {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            altitude: data.coords.altitude
          }
        };
        this.props.getRetailersListAction(requestedData, response => {
        });
      }
    });
  }

  /**
   * @method getCurrentRouteName
   * @description  to perform some aciton on the basis of active route
   */
  getCurrentRouteName = routeName => {
    if (routeName === 'AcceptedRetailers') {
      this.setState({ acceptedTab: true });
    } else if (routeName === 'RemovedRetailers') {
      this.setState({ acceptedTab: false });
    }
  };

  /**
   * @method getActiveRouteName
   * @description  get active route name
   */
  getActiveRouteName = (navigationState) => {

    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return getActiveRouteName(route);
    }
    return route.routeName;
  }

  render() {
    return (
      <Container style={{ color: '#FFFFFF' }}>
        <NavigationEvents onDidFocus={() => this.getRetailerList()} />
        <StatusBar backgroundColor="rgba(255, 255, 255, 0)" barStyle="dark-content" hidden={false} />
        <Loader isLoading={this.props.retailerLoading || this.props.invitationLoading} />
        <HeaderContent
          title={LABELS.USERNAME}
          subTitle={
            this.state.acceptedTab
              ? LABELS.ACCEPTED_RETAILERS
              : LABELS.REMOVED_RETAILERS
          }
          blackTheme
          showProfileSection
          showBugReport
        />
        <RetailerTabsContainer
          screenProps={{
            navigation: this.props.navigation,
          }}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getActiveRouteName(currentState);
            const prevScreen = this.getActiveRouteName(prevState);
            if (prevScreen !== currentScreen) {
              this.getCurrentRouteName(currentScreen);
            }
          }}
        />
      </Container>
    );
  }
}

/**
 * @method mapStateToProps
 * @description return state to component as props
 * @param {*} state
 */
const mapStateToProps = ({ retailers, invitations }) => {
  const { removedRetailerListing, retailerLoading } = retailers;
  const { invitationLoading } = invitations;
  return { removedRetailerListing, retailerLoading, invitationLoading };
};

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 * @param {*} object
 */
export default connect(mapStateToProps, { getRetailersListAction })(Retailers);
