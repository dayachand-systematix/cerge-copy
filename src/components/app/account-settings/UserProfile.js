import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  StatusBar,
  Alert
} from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import {
  HeaderContent,
  Loader,
  Text,
  LabelBox,
  Collapse,
  Input
} from '../../common';
import NavigationService from '../../../services/navigator';
import {
  clearUserData,
  updateUserProfileAPI,
  setUserData,
  onUploadUserProfileImageAPI,
  getPreferenceConfigAction,
  updateUserProfileAction
} from '../../../actions/Profile';
import { leaveStoreAction } from '../../../actions/Common';
import styles from '../../../assets/styles';
import { ValidationComponent, Toast } from '../../../helper';
import { LABELS } from '../../../languageConstants';
import { API, MESSAGES, STATUS_CODES } from '../../../config/';
import { SHOPPING, BROWSING, DND, ASSISTANCE } from '../../../constants';

class UserProfile extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      userImage: '',
      loading: false,
      sourceImage: require('../../../assets/images/default_profile.png'),
      shopperSex: 'male',
      userPreferences: [],
      prefenceDataArray: [],
      selectedData: [],
      showSaveBtn: false
    };
  }

  componentDidMount() {
    let {
      userProfile: { basicUserInfo, shoppingStatus }
    } = this.props;
    if (
      basicUserInfo &&
      basicUserInfo.preferences &&
      basicUserInfo.preferences != null &&
      Array.isArray(basicUserInfo.preferences)
    ) {
      this.setState({ selectedData: basicUserInfo.preferences });
    }
    this.props.getPreferenceConfigAction();
  }

  isSelected = (industry, category, option) => {
    const { selectedData } = this.state;
    const found = selectedData.find(ind => ind.Industry == industry);
    if (found) {
      const catFound = found.category.find(cat => cat.name == category);
      if (catFound) {
        const firstKey = Object.keys(catFound.option)[0];
        return catFound.option[firstKey] == option[firstKey];
      }
    }
    return false;
  };

  getInputValue = (industry, category) => {
    const { selectedData } = this.state;
    const found = selectedData.find(ind => ind.Industry == industry);
    if (found) {
      const catFound = found.category.find(cat => cat.name == category);
      if (catFound) {
        return catFound.value;
      }
    }
    return '';
  };

  updateTextPreferences = (industry, category, value) => {
    const { selectedData } = this.state;
    const foundIndex = selectedData.findIndex(ind => ind.Industry == industry);

    if (foundIndex > -1) {
      const catFoundIndex = selectedData[foundIndex].category.findIndex(
        cat => cat.name == category
      );
      if (catFoundIndex > -1) {
        selectedData[foundIndex].category[catFoundIndex].value = value;
      } else {
        selectedData[foundIndex].category.push({
          name: category,
          value: value
        });
      }
    } else {
      selectedData.push({
        Industry: industry,
        category: [
          {
            name: category,
            value: value
          }
        ]
      });
    }
    this.setState({ selectedData, showSaveBtn: true });
  };

  updatePreferences = (industry, category, option) => {
    const { selectedData } = this.state;
    const foundIndex = selectedData.findIndex(ind => ind.Industry == industry);

    if (foundIndex > -1) {
      const catFoundIndex = selectedData[foundIndex].category.findIndex(
        cat => cat.name == category
      );
      if (catFoundIndex > -1) {
        selectedData[foundIndex].category[catFoundIndex].option = option;
      } else {
        selectedData[foundIndex].category.push({
          name: category,
          option: option
        });
      }
    } else {
      selectedData.push({
        Industry: industry,
        category: [
          {
            name: category,
            option: option
          }
        ]
      });
    }
    this.setState({ selectedData, showSaveBtn: true });
  };

  onPressSavePreferences = () => {
    Keyboard.dismiss();
    const { selectedData } = this.state;
    const { userProfile } = this.props;
    userProfile.basicUserInfo.preferences = selectedData;
    const requestData = {
      basicUserInfo: userProfile.basicUserInfo
    };
    delete requestData.basicUserInfo.profilePhoto;
    this.props.updateUserProfileAction(requestData, res => {
      if (
        res &&
        res.data &&
        res.data.code &&
        res.data.code == STATUS_CODES.OK
      ) {
        Toast.showToast(MESSAGES.PROFILE_UPDATE_SUCESS, 'success');
        this.props.setUserData(userProfile);
        AsyncStorage.setItem('userProfile', JSON.stringify(userProfile)).then(
          () => {
            this.setState({ showSaveBtn: false });
          }
        );
      }
    });
  };

  renderCollapseItems = (option, itemType, isSelected) => {
    return Object.keys(option).map((key, index) => {
      return (
        <View style={styles.formCols} key={index}>
          <LabelBox
            labColor={isSelected ? '#000' : ''}
            label={option[key]}
            isInline
            isBold={isSelected ? true : false}
            medium={isSelected ? true : false}
          />
        </View>
      );
    });
  };

  renderMainCollapse = (category, industry, isLast) => {
    const options = category.categoryOptions;
    const categoryName = category.name;
    const industryName = industry.name;
    return (
      <Collapse
        title={categoryName}
        titleIcon={false}
        customCollapseStyle={{
          margin: 0
        }}
        collapsIndex={1}
        onClickCollaps={index => this.goToTop(index, isLast)}
        isCollapsed={false}
      >
        <View style={{ paddingLeft: 10 }}>
          {/*<View style={[styles.formRows, paddingTop.Ten]}>
                  <View style={styles.column}>
                    <Text style={{ fontWeight: 'bold', color: valColor }}>
                      TO FIT CHEST SIZE
                    </Text>
                  </View>
                </View>*/}
          <View
            style={[
              styles.formRows,
              paddingTop.Five,
              {
                color: '#FFFFFF',
                fontWeight: 'bold',
                backgroundColor: '#231F20'
              }
            ]}
          >
            {options &&
              Array.isArray(options) &&
              options.map((data, index) => {
                if (index < 1) {
                  return Object.keys(data.option).map((key, index) => {
                    return (
                      <View style={styles.formCols} key={index}>
                        <LabelBox
                          large
                          labColor={'#FFFFFF'}
                          label={key}
                          isInline
                        />
                      </View>
                    );
                  });
                }
              })}
          </View>
          {options &&
            Array.isArray(options) &&
            options.length > 0 &&
            options.map(item => {
              const isSelected = this.isSelected(
                industryName,
                categoryName,
                item.option
              );
              const lineStyle = isSelected
                ? [styles.formRows, innerStyle.bdrDark, { borderBottomWidth: 2, borderTopWidth: 2, }]
                : [styles.formRows, innerStyle.bottomBdrLight];
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.updatePreferences(
                      industryName,
                      categoryName,
                      item.option
                    )
                  }
                  style={lineStyle}
                >
                  {this.renderCollapseItems(
                    item.option,
                    category.name,
                    isSelected
                  )}
                </TouchableOpacity>
              );
            })}
        </View>
      </Collapse>
    );
  };

  renderTextCollapse = (category, industries, isLast) => {
    const categoryName = category.name;
    const industryName = industries.name;
    const inputValue = this.getInputValue(industryName, categoryName);
    return (
      <Collapse
        title={category.name}
        titleIcon={false}
        customCollapseStyle={{
          margin: 0
        }}
        collapsIndex={1}
        onClickCollaps={index => this.goToTop(index, isLast)}
        isCollapsed={false}
      >
        <View>
          <Input
            isDisabled={false}
            maxLength={50}
            onChangeText={val =>
              this.updateTextPreferences(industryName, categoryName, val)
            }
            value={inputValue}
          />
        </View>
      </Collapse>
    );
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.userPreferences !== this.props.userPreferences &&
      typeof nextProps.userPreferences !== 'undefined'
    ) {
      const {
        userProfile: { basicUserInfo },
        userPreferences
      } = nextProps;
      console.log('basicUserInfo.name', basicUserInfo);

      const sourceImage = {
        uri:
          basicUserInfo &&
            basicUserInfo.profilePhoto &&
            basicUserInfo.profilePhoto != undefined &&
            basicUserInfo.profilePhoto != null
            ? API.DownloadImage + '?key=' + basicUserInfo.profilePhoto
            : ''
      };

      this.setState({
        sourceImage,
        userPreferences,
        shopperSex:
          basicUserInfo &&
            basicUserInfo.sex &&
            basicUserInfo.sex != undefined &&
            basicUserInfo.sex != null
            ? basicUserInfo.sex.toLowerCase()
            : ''
      });
    }
  }

  renderDataCollapse = category => {
    const options = category.categoryOptions;
    const { shopperSex } = this.state;
    return (
      <Collapse
        title={category.name}
        titleIcon={false}
        customCollapseStyle={{
          margin: 0
        }}
        isCollapsed={false}
      >
        <View style={{ paddingLeft: 10 }}>
          <View
            style={[
              styles.formRows,
              paddingTop.Five,
              {
                color: '#FFFFFF',
                fontWeight: 'bold',
                backgroundColor: '#231F20'
              }
            ]}
          >
            <View style={[styles.formRows, innerStyle.bdrDark]}>
              <View style={styles.formCols}>
                <LabelBox isBold labColor={'#000'} label={'AUS'} isInline />
              </View>
              <View style={[styles.formCols]}>
                <LabelBox isBold labColor={'#000'} label={'UK'} isInline />
              </View>
              <View style={[styles.formCols]}>
                <LabelBox isBold labColor={'#000'} label={'US'} isInline />
              </View>
              <View style={[styles.formCols]}>
                <LabelBox isBold labColor={'#000'} label={'EUR'} isInline />
              </View>
            </View>
          </View>
        </View>
      </Collapse>
    );
  };

  logOutUser = () => {
    AsyncStorage.removeItem("isLoggedIn");
    Toast.showToast(MESSAGES.LOGOUT_SUCCESS, "success");
    NavigationService.navigate("AuthLoading");
  }

  /**
   * @method conFirmLogout
   * @description  used to logout from application
   */
  conFirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => {
            style: 'cancel';
          }
        },
        { text: 'Yes', onPress: () => this.logOutUser() }
      ],
      { cancelable: false }
    );
  };

  loadFallback = () => {
    this.setState({
      sourceImage: require('../../../assets/images/default_profile.png')
    });
  };

  goToTop = (index, isLast) => {
    if (isLast) {
      setTimeout(() => {
        this.component._root.scrollToEnd();
      }, 500);
    }
  };

  /**
   * @method renderStatusImage
   * @description  render the status image according to user status
   */
  renderStatusImage = shoppingStatus => {
    const status =
      shoppingStatus && shoppingStatus != null
        ? shoppingStatus.shoppingStatus
        : 'N/A';
    let image = require('../../../assets/images/ShoppingIcon.png');

    switch (status) {
      case SHOPPING:
        image = require('../../../assets/images/ShoppingIcon.png');
        break;
      case BROWSING:
        image = require('../../../assets/images/Browsing.png');
        break;
      case DND:
        image = require('../../../assets/images/DND.png');
        break;
      case ASSISTANCE:
        image = require('../../../assets/images/Assistance.png');
        break;
      default:
        image = require('../../../assets/images/ShoppingIcon.png');
        break;
    }
    return (
      <View style={{ marginTop: 5 }}>
        <Image style={{ width: 20, height: 20 }} source={image} />
      </View>
    );
  };

  /**
   * @method render
   * @description  render Component
   */
  render() {
    const {
      userProfile: { basicUserInfo, shoppingStatus }
    } = this.props;
    const { shopperSex } = this.state;
    const birthday = moment(
      basicUserInfo &&
        basicUserInfo.dob &&
        basicUserInfo.dob != undefined &&
        basicUserInfo.dob != null
        ? basicUserInfo.dob
        : new Date()
    );
    const age = moment().diff(birthday, 'years');
    const userSex =
      basicUserInfo &&
        basicUserInfo.sex &&
        basicUserInfo.sex != undefined &&
        basicUserInfo.sex != null
        ? basicUserInfo.sex
        : '';
    const { sourceImage, userPreferences } = this.state;
    return (
      <Container>
        <Loader isLoading={this.props.loading} />
        <StatusBar
          backgroundColor='rgba(255, 255, 255, 0)'
          barStyle='dark-content'
          hidden={false}
        />
        <HeaderContent
          title={LABELS.USERNAME}
          subTitle={LABELS.YOUR_PROFIE}
          blackTheme
          showProfileSection={false}
          showPrefrenceBtn={this.state.showSaveBtn}
          submitSavePreferences={this.onPressSavePreferences}
        />
        <Content
          ref={c => (this.component = c)}
          style={{ marginTop: 10, marginBottom: 20 }}
        >
          <View
            style={[
              styles.bgWhite,
              paddingTop.Ten,
              { paddingLeft: 10, paddingRight: 10 }
            ]}
          >
            <View style={{ alignItems: 'center' }}>
              <View style={innerStyle.iconWrapper}>
                <Image
                  source={sourceImage}
                  style={{ height: 100, width: 100 }}
                  onError={() => this.loadFallback()}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Text style={styles.titleText}>
                  {basicUserInfo &&
                    basicUserInfo.name &&
                    basicUserInfo.name != undefined &&
                    basicUserInfo.name != null
                    ? basicUserInfo.name
                    : 'N/A'}
                </Text>

                <TouchableOpacity
                  style={{ position: 'absolute', right: -30 }}
                  onPress={() => this.props.navigation.navigate('BasicProfile')}
                >
                  <Icon
                    style={[
                      {
                        fontSize: 20,
                        color: '#87939F',
                        marginTop: 20,
                        marginLeft: 10
                      }
                    ]}
                    name={'md-create'}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: valColor,
                  textAlign: 'center',
                  fontFamily: fontBoldItalic
                }}
              >
                {`${age}${' years'}`}{' '}
                {shopperSex && shopperSex !== undefined && shopperSex !== ''
                  ? `${','}${shopperSex}`
                  : 'N/A'}
              </Text>
              {this.renderStatusImage(shoppingStatus)}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Text style={{ color: valColor, fontFamily: fontBoldItalic }}>
                  {shoppingStatus && shoppingStatus != null && shoppingStatus.shoppingStatus && shoppingStatus.shoppingStatus != ''
                    ? shoppingStatus.shoppingStatus
                    : 'Enter your status'}
                </Text>
                <TouchableOpacity
                  style={{ position: 'absolute', right: -30 }}
                  onPress={() => this.props.navigation.navigate('Shopping')}
                >
                  <Icon
                    style={[{ fontSize: 20, color: '#87939F' }]}
                    name={'md-create'}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 5
                }}
              >
                <Text style={{ fontFamily: fontBoldItalic }}>
                  {shoppingStatus && shoppingStatus != null && shoppingStatus.shoppingRequirement && shoppingStatus.shoppingRequirement != ''
                    ? shoppingStatus.shoppingRequirement
                    : ''}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('TermCondition')}>
                  <Text style={{fontSize: 16, color: '#0076D9', textDecorationLine: 'underline'}}>Terms of Service</Text>
                </TouchableOpacity>

                <View style={{marginLeft: 5, marginRight: 5}}>
                  <Text style={{fontSize: 16, color: '#000'}}>&</Text>
                </View>

                <TouchableOpacity onPress={()=>this.props.navigation.navigate('PrivacyPolicy')}>
                  <Text style={{fontSize: 16, color: '#0076D9', textDecorationLine: 'underline'}}>Privacy Policy</Text>
                </TouchableOpacity>

              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 10
                }}
              >
                <TouchableOpacity onPress={this.conFirmLogout}>
                  <Icon
                    style={[{ color: '#87939F', fontSize: 25 }]}
                    name={'log-out'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.formRows,
                {
                  borderBottomColor: valColor,
                  borderBottomWidth: 1,
                  paddingBottom: 3
                }
              ]}
            >
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: valColor,
                    marginLeft: 10
                  }}
                >
                  {LABELS.MY_PREFRENCES}
                </Text>
              </View>
            </View>
            <View>
              {userPreferences &&
                Array.isArray(userPreferences) &&
                userPreferences.map(industries => {
                  const categories = industries.category;
                  if (
                    categories &&
                    Array.isArray(categories) &&
                    categories.length > 0
                  ) {
                    return [
                      <View
                        style={{
                          borderBottomColor: valColor,
                          borderBottomWidth: 1,
                          paddingBottom: 3,
                          marginTop: 18
                        }}
                      >
                        <Text style={{ fontWeight: 'bold', color: valColor }}>
                          {industries.name}
                        </Text>
                      </View>,
                      categories.map((category, ind) => {
                        const isLast =
                          categories.length - 1 === ind ? true : false;
                        if (
                          category.sex == 'Both' ||
                          category.sex.toLowerCase() == userSex.toLowerCase()
                        ) {
                          if (category.type === 'ddl') {
                            return this.renderMainCollapse(
                              category,
                              industries,
                              isLast
                            );
                          } else {
                            return this.renderTextCollapse(
                              category,
                              industries,
                              isLast
                            );
                          }
                        }
                      })
                    ];
                  }
                })}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const innerStyle = StyleSheet.create({
  passwordText: {
    fontSize: 18,
    color: '#040605',
    borderBottomColor: '#040605',
    borderBottomWidth: 1,
    borderStyle: 'solid'
  },
  btnWidth: {
    width: '100%',
    minWidth: '100%'
  },
  cameraWrap: {
    width: 28,
    height: 28,
    backgroundColor: '#6E68B0',
    padding: 3,
    borderRadius: 50,
    textAlign: 'center',
    alignItems: 'center'
  },
  cameraimage: {
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 5,
    color: '#fff',
    fontSize: 16
  },
  cameraimagewrap: {
    position: 'absolute',
    bottom: 10,
    right: -5
  },
  boxIcon: {
    fontSize: 30
  },
  profileBox: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#C9D2DB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  bdrDark: {
    borderBottomWidth: 1,
    borderBottomColor: '#778389',
    borderTopWidth: 1,
    borderTopColor: '#778389'
  },
  bottomBdrLight: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E7E8'
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderWidth: 0,
    backgroundColor: '#EFEFEF',
    borderRadius: 50,
    overflow: 'hidden'
  },
  inputIcon: {
    color: '#87939F',
    marginTop: 15,
    marginLeft: 30
  }
});

const mapStateToProps = ({ profile }) => {
  const { loading, userProfile, userPreferences } = profile;
  return {
    loading,
    userProfile,
    userPreferences
  };
};

export default connect(mapStateToProps, {
  updateUserProfileAPI,
  onUploadUserProfileImageAPI,
  clearUserData,
  getPreferenceConfigAction,
  updateUserProfileAction,
  setUserData,
  leaveStoreAction
})(UserProfile);
