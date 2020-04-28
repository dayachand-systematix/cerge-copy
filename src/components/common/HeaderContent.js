import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { View, StyleSheet, Image, TouchableOpacity, Platform, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Text } from '../common';
import styles from '../../assets/styles';
import LinkText from './LinkText';
import { API, DATE_FORMAT, TIME_FORMAT, STATUS_CODES } from '../../config/';
import { LABELS } from '../../languageConstants';
import { UpdateShoppingStatusAction } from '../../actions/Shopping';
import { getUserProfileAction } from '../../actions/Profile';
import {SHOPPING} from "../../constants";

class HeaderContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: '',
      userName: '',
      sourceImage: require('../../assets/images/default_profile.png')
    };
  }

  componentDidMount() {
    this.setUserDetail();
    this.updateStatus();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.userProfile &&
      nextProps.userProfile != this.props.userProfile &&
      nextProps.userProfile.basicUserInfo
    ) {
      const {
        userProfile: { basicUserInfo }
      } = nextProps;
      if (basicUserInfo && basicUserInfo.name) {
        const sourceImage = { uri: API.DownloadImage + '?key=' + basicUserInfo.profilePhoto };
        this.setState({
          sourceImage: sourceImage &&
            sourceImage != null &&
            sourceImage != 'undefined' ?
            sourceImage : require('../../assets/images/default_profile.png'),
          userName: basicUserInfo.name &&
            basicUserInfo.name != null &&
            basicUserInfo.name != 'undefined' ? basicUserInfo.name.toUpperCase() : 'N/A'
        });
      }
    }
  }

  /**
   * @method onPressProfileImage
   * @description navigation on props screen
   */
  onPressProfileImage = () => {
    this.props.navigation.navigate('UserProfile');
  };

  onPressSavePreferences = () => {
    this.props.submitSavePreferences();
  }

  setUserDetail = () => {
    const {
      userProfile: { basicUserInfo }
    } = this.props;
    if (basicUserInfo && basicUserInfo.name) {
      const sourceImage = { uri: API.DownloadImage + '?key=' + basicUserInfo.profilePhoto };
      this.setState({
        sourceImage: sourceImage &&
          sourceImage != null &&
          sourceImage != 'undefined' ?
          sourceImage : require('../../assets/images/default_profile.png'),
        userName: basicUserInfo.name &&
          basicUserInfo.name != null &&
          basicUserInfo.name != 'undefined' ? basicUserInfo.name.toUpperCase() : 'N/A'
      });
    }
  };

  callUpdateStatusAPI = () => {
    const requestData = {
      userShoppingStatus: {
        shoppingStatus: SHOPPING,
        shoppingRequirement: '',
        shoppingDate: '',
        fromTime: '',
        toTime: '',
      }
    };
    this.props.UpdateShoppingStatusAction(requestData, res => {
      console.log('userProfile update', res)
      if (res && res.data && res.data.code && res.data.code == STATUS_CODES.OK) {
        this.props.getUserProfileAction(response => {
          if (response && response.data && response.data.data && response.data.data.userProfile) {
            const { userProfile } = response.data.data;
            AsyncStorage.setItem('userProfile', JSON.stringify(userProfile)).then(
              () => {
                console.log('Success');
              });
          }
        });
      }
    });
  }

  /**
   * @method updateStatus
   * @description to check and update the shoppers staus from the local storage
   */
  updateStatus = () => {
    const { userProfile: { shoppingStatus } } = this.props;
    const temp = moment();
    if (shoppingStatus != null && shoppingStatus.shoppingDate != null &&
      shoppingStatus.shoppingDate != undefined &&
      shoppingStatus.shoppingDate != '' && shoppingStatus.toTime != null &&
      shoppingStatus.toTime != undefined && shoppingStatus.toTime != '') {
      if (moment(temp).isSame(shoppingStatus.shoppingDate, 'day') === true &&
        moment(shoppingStatus.toTime).diff(moment(temp), 'seconds') < -1) {
        //call update status API if to time Date is greater then current Date
        this.callUpdateStatusAPI();
      }
    }
  }

  loadFallback = () => {
    this.setState({
      sourceImage: require('../../assets/images/default_profile.png')
    });
  };

  /**
   * @method render
   * @description to render component
   */
  render() {
    const props = this.props;
    const { userProfile: { basicUserInfo, shoppingStatus } } = this.props;

    const { sourceImage } = this.state;
    let image;
    let welcomeText = innerStyle.welcomeText;
    let innerText = innerStyle.innerText;
    if (props.blackTheme !== undefined && props.blackTheme === true) {
      image = require('../../assets/images/Line1.png');
    } else {
      image = require('../../assets/images/whiteLine.png');
      welcomeText = [innerStyle.welcomeText, { color: '#FFFFFF' }];
      innerText = [innerStyle.innerText, { color: '#FFFFFF' }];
    }
    const userName = basicUserInfo && basicUserInfo.name ? basicUserInfo.name.toUpperCase() : '';
    return (
      <View style={innerStyle.header}>
        <View style={innerStyle.row70}>
          <Text style={welcomeText}>{`${
            props.title
            } ${userName}`}</Text>
          <View style={[styles.row]}>
            <Text style={innerText}>{props.subTitle}</Text>
            {props.linkExist && (
              <View style={{ right: 5, top: Platform.OS === 'ios' ? 4 : 1 }}>
                <LinkText
                  linkTextData={props.linkText}
                  textColorCode={'#0076D9'}
                  linkNavigation={props.linkNavigation}
                  props={this.props.navigation}
                />
              </View>
            )}
          </View>

          <View style={innerStyle.textLine}>
            <Image source={image} style={innerStyle.innerTextLine} />
          </View>
        </View>

          {props.showBugReport &&
          <View style={props.showProfileSection?[innerStyle.row15]:{width: '32%', alignItems: 'flex-end', paddingRight: 10}}>
            <LinkText
                linkTextData={'Report a bug'}
                textColorCode={'#0076D9'}
                linkNavigation={'EMAIL'}
                props={this.props.navigation}
            />
          </View>
          }

        {props.showProfileSection && (
          <View style={[innerStyle.row30, { alignItems: 'flex-end' }]}>
            <TouchableOpacity onPress={this.onPressProfileImage}>
              <Image
                onError={() => this.loadFallback()}
                source={sourceImage}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 20,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#C9D2DB',
                }}
              />
            </TouchableOpacity>
          </View>
        )}
        {props.showPrefrenceBtn !== undefined && props.showPrefrenceBtn && (
          <View style={[innerStyle.row30, { alignItems: 'flex-end' }]}>
            <TouchableOpacity
              onPress={this.onPressSavePreferences}
              style={{
                flexDirection: 'row-reverse'
              }}
            >
              <Text
                style={[{ marginRight: 10, color: '#231F20', fontSize: 20, }]}
              >
                {LABELS.SAVE}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  welcomeText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: fontRegular,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textLine: {
    paddingLeft: 10,
    top: 5
  },
  row70: {
    width: '68%'
  },
    row15: {
        width: '12%',
    },
  row30: {
    width: '20%',
  },
  innerText: {
    color: '#000000',
    fontFamily: fontRegular,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  innerTextLine: {
    width: '13%',
    height: 1
  },
  header: {
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: getStatusBarHeight(),
    height: 70 + getStatusBarHeight(),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 0,
    padding: 0,
  },
});

/**
 * @method mapStateToProps
 * @description return state to component as props
 * @param {*} state
 */
function mapStateToProps({ auth, profile }) {
  const { email, error, loading, isIntroShowed } = auth;
  const { userProfile } = profile;
  return { email, error, loading, isIntroShowed, userProfile };
}

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 */
const withNavigationClass = withNavigation(HeaderContent);
export default connect(mapStateToProps, { UpdateShoppingStatusAction, getUserProfileAction })(withNavigationClass);
