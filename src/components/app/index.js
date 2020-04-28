/* eslint-disable no-else-return */
import React from "react";
import { Image, View, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Invitations from "../app/invitations";
import Shopping from "../app/shopping/index";
import Rate from "./review-rating/Rating";
import InvitationAccept from "./invitations/InvitationAccept";
import InvitationFilter from "./invitations/InvitationsFilter";
import InvitationDetail from "./invitations/InvitationDetail";
import AcceptingInvitation from "./invitations/AcceptingInvitation";
import Review from "./review-rating";
import UserProfile from "./account-settings/UserProfile";
import Retailers from "./retailers";
import BasicProfile from "./initial-setup/Profile";
import { RetailerCounter } from "./retailers/RetailerCounter";
import { InvitationCounter } from "./invitations/InvitationCounter";
import { ShoppingStatus } from "./shopping/ShoppingStatus";
import { Invitation } from './bottom-navigation/Invitation';
import { Retailer } from './bottom-navigation/Retailer';
import { ReviewAndRating } from './bottom-navigation/ReviewAndRating';
import PrivacyPolicy from "../auth/login/PrivacyPolicy";
import TermCondition from "../auth/login/TermCondition";

const InvitationStack = createStackNavigator(
  {
    Invitations: {
      screen: Invitations
    },
    AcceptingInvitation: {
      screen: AcceptingInvitation
    },
    InvitationAccept: {
      screen: InvitationAccept
    },
    InvitationsDetail: {
      screen: InvitationDetail
    }
  },
  {
    headerMode: "none"
  }
);

const RetailerStack = createStackNavigator(
  {
    Retailers: {
      screen: Retailers
    },
    InvitationsDetail: {
      screen: InvitationDetail
    },
    AcceptingInvitation: {
      screen: AcceptingInvitation
    }
  },
  {
    headerMode: "none"
  }
);

handleTabPress = ({ navigation }) => {
  navigation.popToTop();
  navigation.navigate(navigation.state.routeName);
};

const MyStackNavigator = createBottomTabNavigator(
  {
    Shopping: {
      screen: Shopping,
      navigationOptions: {
        tabBarLabel: "SHOPPING"
      }
    },
    Invitations: {
      screen: InvitationStack,
      navigationOptions: {
        tabBarLabel: "INVITATIONS",
        tabBarOnPress: this.handleTabPress
      }
    },
    Retailers: {
      screen: RetailerStack,
      navigationOptions: {
        tabBarLabel: "RETAILERS",
        tabBarOnPress: this.handleTabPress
      }
    },
    Reviews: {
      screen: Review,
      navigationOptions: {
        tabBarLabel: "REVIEWS"
      }
    }
  },
  {
    initialRouteName: "Invitations",
    //resetOnBlur: true,
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "Shopping") {
          if (focused) {
            return focused && <ShoppingStatus focused={focused} />;
          } else {
            return <ShoppingStatus focused={focused} />;
          }
        } else if (routeName === "Invitations") {
          if (focused) {
            return focused && <Invitation focused={focused} />;
          } else {
            return <Invitation focused={focused} />;
          }
        } else if (routeName === "Retailers") {
          if (focused) {
            return focused && <Retailer focused={focused} />;
          } else {
            return <Retailer focused={focused} />;
          }
        } else if (routeName === "Reviews") {
          if (focused) {
            return focused && <ReviewAndRating focused={focused} />;
          } else {
            return <ReviewAndRating focused={focused} />;
          }
        }
      }
    }),
    tabBarOptions: {
      activeTintColor: "#778389",
      inactiveTintColor: "#000000",
      keyboardHidesTabBar: false,
      labelStyle: {
        fontSize: 14,
        borderBottomColor: "#000000",
        borderBottomWidth: 3
      },
      showLabel: false,
      showIcon: true,
      style: {
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#D3D3D3",
        height: 61
      }
    }
  }
);

const MainApp = createStackNavigator(
  {
    MainApp: {
      screen: MyStackNavigator
    },
    UserProfile: {
      screen: UserProfile
    },
    Rate: {
      screen: Rate
    },
    BasicProfile: {
      screen: BasicProfile,
      // navigationOptions: {
      //   gesturesEnabled: false
      // }
    },
    InvitationsDetail: {
      screen: InvitationDetail
    },
    InvitationsFilter: {
      screen: InvitationFilter
    },
      PrivacyPolicy: {
        screen: PrivacyPolicy
      },
      TermCondition: {
        screen: TermCondition
      }
  },
  {
    headerMode: "none"
  }
);

const AppStack = createAppContainer(MainApp);

export default AppStack;
