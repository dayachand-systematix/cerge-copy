import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import styles from '../../../assets/styles';
import { ValidationComponent, locationPermissionModalOne } from '../../../helper';
import { getInvitationListAction, getSearchNearMeListAction } from '../../../actions/Invitations';
import InvitationFilterModal from './InvitationFilterModal';
import {
  Text,
  InputBox,
  Button,
  HeaderContent,
  LabelComponent,
  Loader
} from '../../common';
import { LABELS } from '../../../languageConstants';
import { DEFAULT_RADIUS, GOOGLE_API_KEY } from '../../../config';

class InvitationFilter extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      shoppingRequirement: '',
      shoppingPlace: '',
      userLocation: {},
      isVisiable: false
    };
  }

  /**
    * @method checkValidation
    * @description called to check validations
    */
  checkValidation = () => {
    /* Call ValidationComponent validate method */
    this.validate({
      shoppingRequirement: {
        required: true,
        maxlength: 140
      }
    });
    this.setState({ error: true });
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
        /*     this.checkValidation(); */
      }
    });
  };

  /**
   * @method onPressSubmitButton
   * @description Call shopping post API
   */
  onPressSubmitButton = async () => {
    Keyboard.dismiss();

    this.setState({ isSubmitted: true });
    const configSetting = await AsyncStorage.getItem('configSetting');
    const setting = configSetting != null ? JSON.parse(configSetting) : {};
    const { SearchRadius } = setting;
    const { userLocation } = this.state;
    /*  this.checkValidation(); */
    if (this.isFormValid() && userLocation.lat != undefined && userLocation.lat != '') {
      const requestData = {
        radius: SearchRadius && SearchRadius != null && SearchRadius !== undefined ? SearchRadius : DEFAULT_RADIUS,
        location: {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          altitude: userLocation.alt
        }
      };
      this.props.getInvitationListAction(requestData, false, response => {
        this.props.navigation.navigate('Invitations');
      });
    }
  };

  /**
   * @method onPressCancelImage
   *@description call for navigate route
   */
  onPressCancelImage = () => {
    this.props.navigation.goBack();
  };

  /**
   * @method autocompleteAddress
   * @description used to set the latitude, longitude and address in state
   */
  autocompleteAddress = (lat, lng, details) => {
    const userLocation = {
      lat, lng, alt: 0
    };
    this.setState({ userLocation, locationName: details.formatted_address });
  };

  /**
    * @method closeModal
    * @description hide filter module
    */
  closeModal = () => {
    this.setState({ isVisiable: false });
  }

  /**
   * @method searchNearMeDetail
   * @description set to state when data is select from modal
   * @param object
   */
  searchNearMeDetail = (item) => {
    const userLocation = {
      lat: item.lat,
      lng: item.lng,
      alt: 0
    };
    this.setState({ userLocation, isVisiable: false, locationName: `${item.name}${' '}${item.address}` });
  }

  /**
   * @method searchNearMe
   * @description call google search API action
   */
  searchNearMe = async () => {
    const configSetting = await AsyncStorage.getItem('configSetting');
    const setting = configSetting != null ? JSON.parse(configSetting) : {};
    const { SearchRadius } = setting;
    this.setState({ isVisiable: true }, () => {
      locationPermissionModalOne(data => {
        if (data !== false) {
          const requestData = {
            radius: SearchRadius && SearchRadius != null && SearchRadius !== undefined ? SearchRadius : DEFAULT_RADIUS,
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            type: 'Clothing%20store',
            pagetoken: '',
            key: GOOGLE_API_KEY//'AIzaSyBRaP2V6woKa6mQ8AE9Sej0YUFd-aO1J-4'
          };
          this.props.getSearchNearMeListAction(requestData);
        }
      });
    });
  }

  /**
   * @method render
   * @description to render component
   */
  render() {
    const { shoppingRequirement, isSubmitted, userLocation } = this.state;
    return (
      <Container style={innerStyle.container}>
        <StatusBar backgroundColor="rgb(0, 0, 0)" barStyle="light-content" hidden={false} />
        {(!this.state.isVisiable) && <Loader isLoading={this.props.invitationLoading} />}
        <HeaderContent
          title={LABELS.USERNAME}
          subTitle={LABELS.SEARCH_INVITATIONS_SUBTITLE}
          blackTheme={false}
          showProfileSection={false}
        />
        <Content>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row-reverse' }}
            onPress={this.onPressCancelImage}
          >
            <Image
              source={require('../../../assets/images/Cancle.png')}
              style={{
                width: 40,
                height: 40,
                left: 20,
                marginBottom: 10
              }}
            />
          </TouchableOpacity>
          <View style={[styles.flexOne, innerStyle.mainPWwrap]}>
            <View>
              <InputBox
                label={LABELS.SHOPPING_FOR}
                mandatory={false}
                isDisabled
                placeholder={LABELS.SHOPPING_FOR_PLACEHOLDER}
                onChangeText={this.onInputValueChanged('shoppingRequirement')}
                maxLength={142}
                value={shoppingRequirement}
                placeholderTextColor='#2C3138'
                isFieldInError={this.isFieldInError('shoppingRequirement')}
                fieldErrorMessage={this.getErrorsInField('shoppingRequirement')}
                blackTheme
              />
            </View>
            <View>
              <LabelComponent label={LABELS.AT_THIS_PLACE} blackTheme mandatory />
              <View
                style={{
                  backgroundColor: '#000',
                  color: '#FFFFFF',
                  marginTop: 15
                }}
              >
                <GooglePlacesAutocomplete
                  placeholder='Search'
                  placeholderTextColor={isSubmitted && (userLocation.lat == '' || userLocation.lat === undefined) ? 'rgba(242, 38, 19, 0.5)' : 'rgba(255,255,255, 0.5)'}
                  minLength={2} // minimum length of text to search
                  autoFocus={false}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  listViewDisplayed='false' //true/false/undefined
                  fetchDetails
                  currentLocationLabel='Current location'
                  renderDescription={row => row.description} // custom description render
                  enablePoweredByContainer={false}
                  onPress={(data, details = null) => {
                    this.autocompleteAddress(
                      details.geometry.location.lat,
                      details.geometry.location.lng,
                      details
                    );
                  }}
                  text={this.state.locationName}
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: GOOGLE_API_KEY,
                    language: 'en', // language of the results
                    types: ['address', '(cities)'] // default: 'geocode'
                  }}
                  styles={{
                    description: {
                      fontFamily: fontRegular,
                      borderBottomWidth: 0,
                      color: '#FFFFFF',
                    },
                    textInputContainer: {
                      backgroundColor: '#000000',
                      borderTopWidth: 0,
                      fontFamily: fontRegular,
                      borderBottomWidth: 1,
                      borderBottomColor: isSubmitted && (userLocation.lat == '' || userLocation.lat === undefined) ? 'red' : 'gray'
                    },
                    textInput: {
                      marginLeft: 0,
                      paddingLeft: 0,
                      borderWidth: 0,
                      color: '#FFFFFF',
                      backgroundColor: '#000000',
                      fontSize: 15,
                      fontFamily: fontRegular
                    },
                    predefinedPlacesDescription: {
                      color: '#FFFFFF'
                    }
                  }}
                  //currentLocation
                  // currentLocationLabel='Current location'
                  nearbyPlacesAPI='GooglePlacesSearch'
                  GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    types: 'Clothing%20store'
                  }}
                  filterReverseGeocodingByTypes={[
                    'locality',
                    'administrative_area_level_3'
                  ]}
                  //predefinedPlaces={[homePlace, workPlace]}
                  debounce={200}
                />
              </View>
            </View>
            <TouchableOpacity style={{ marginTop: 8 }} onPress={this.searchNearMe}>
              <Text style={innerStyle.text}>{LABELS.SEARCH_NEAR_ME}</Text>
            </TouchableOpacity>
            <View
              style={[
                //styles.gridRows,
                //paddingTop.Twenty,
                paddingLeft.Ten,
                paddingRight.Ten,
               //styles.verticalCenter
              ]}
            />
            <Button
              title={LABELS.SEARCH_INVITATIONS}
              onPress={() => this.onPressSubmitButton()}
            />
          </View>
        </Content>
        {this.state.isVisiable && <InvitationFilterModal
          isVisiable={this.state.isVisiable}
          closeModal={this.closeModal}
          searchNearMeDetail={(item) => this.searchNearMeDetail(item)}
          modalLoading={this.props.invitationLoading ? true : false}
          type={
            this.props.invitationFilterListing.length > 0 ? this.props.invitationFilterListing : []
          }
        />}
      </Container>
    );
  }
}

/**
* @method mapStateToProps
* @description return state to component as props
* @param {*} state
*/
const mapStateToProps = ({ invitations }) => {
  const { invitationFilterListing, invitationLoading } = invitations;
  return { invitationFilterListing, invitationLoading };
};

/**
* @method connect
* @description connect with redux
* @param {function} mapStateToProps
* @param {*} object
*/
export default connect(mapStateToProps,
  {
    getInvitationListAction,
    getSearchNearMeListAction
  })(InvitationFilter);

const innerStyle = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    opacity: 1
  },
  text: {
    textAlign: 'left',
    letterSpacing: 1.35,
    color: '#FFFFFF',
    textDecorationLine: 'underline'
  },
  mainPWwrap: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15
  },
  btnWidth: {
    width: '100%',
    minWidth: '100%'
  }
});
