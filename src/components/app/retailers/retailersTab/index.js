import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import AcceptedRetailers from './AcceptedRetailers';
import RemovedRetailers from './RemovedRetailers';

const RetailerTabs = createMaterialTopTabNavigator(
  {
    AcceptedRetailers: {
      screen: AcceptedRetailers,
      navigationOptions: ({ navigation }) => (
        {
          tabBarVisible: navigation.state.isVisible,
          tabBarLabel: 'TRUSTED BUSINESSES',
        })
    },
    RemovedRetailers: {
      screen: RemovedRetailers,
      navigationOptions: ({ navigation }) => (
        {
          tabBarVisible: navigation.state.isVisible,
          tabBarLabel: 'BLOCKED BUSINESSES',
        })
    }
  },
  {
    initialRouteName: 'AcceptedRetailers',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: '#000000',
      inactiveTintColor: '#808080',
      labelStyle: {
        fontSize: 14
      },
      showLabel: true,
      showIcon: false,
      style: {
        backgroundColor: '#FFFFFF',
        marginTop: 3
      },
      indicatorStyle: { backgroundColor: 'transparent' }
    }
  }
);

const RetailerTabsContainer = createAppContainer(RetailerTabs);

export default RetailerTabsContainer;
