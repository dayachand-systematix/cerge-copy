import React, { PureComponent } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,
    NativeModules
} from 'react-native';
import { connect } from 'react-redux';
import {
    updateUserData
} from '../actions/Common';
import { setUserData, clearUserData } from '../actions/Profile';
import { LABELS } from '../languageConstants';

const GeoLocationData = NativeModules.GeoLocation;

const deviceHeight = Dimensions.get('window').height;

class AuthLoadingScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.bootstrapAsync();
    }

    /**
     * @method bootstrapAsync
     * @description Fetch the token from storage then navigate to our appropriate place
     */
    bootstrapAsync = async () => {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const authToken = await AsyncStorage.getItem('auth_token');
        const userData = await AsyncStorage.getItem('userProfile');
        const userProfile = userData != null ? JSON.parse(userData) : {};
        if (isLoggedIn == 'true') {
            const userAuthToken = axios.defaults.headers.common.Token;
            if (
                typeof userAuthToken === 'undefined' ||
                userAuthToken === '' ||
                userAuthToken == null
            ) {
                axios.defaults.headers.common.Token = `${authToken}`;
            }
            this.startTracking();
            const { basicUserInfo } = userProfile;
            if (basicUserInfo) {
                this.props.setUserData(userProfile);
                this.props.navigation.navigate('App');
            } else {
                this.props.navigation.navigate('InitialProfile');
            }
        } else {
            this.stopTracking();
            setTimeout(() => {
                axios.defaults.headers.common.Token = '';
                AsyncStorage.removeItem('isLoggedIn');
                AsyncStorage.removeItem('auth_token');
                AsyncStorage.removeItem('userProfile');
                AsyncStorage.removeItem('configSetting');
                this.props.clearUserData();
                this.props.navigation.navigate('Auth');
            }, 1000);
        }
    };

    async startTracking() {
        const authToken = await AsyncStorage.getItem('auth_token');
        GeoLocationData.startService(authToken);
    }

    async stopTracking() {
        const authToken = await AsyncStorage.getItem('auth_token');
        GeoLocationData.checkInStore(authToken);
    }

    /**
     * @method render
     * @description Render any loading content or splash screen that you like here
     */
    render() {
        return (
            <View
                style={[
                    innerStyles.container,
                    {
                        justifyContent: 'center',
                        height: deviceHeight,
                        alignItems: 'center'
                    }
                ]}
            >
              <View>
                <ActivityIndicator size='large' />
                <Text style={{ fontWeight: 'bold', fontSize: 16, top: 10 }}>
                    {LABELS.PLEASE_WAIT}
                </Text>
              </View>
            </View>
        );
    }
}

/**
 * @method mapStateToProps
 * @description return state to component as props
 @param {} state
 */
function mapStateToProps({ common, profile }) {
    const { error, loading, resetPing } = common;
    const { userProfile } = profile;
    return { error, loading, userProfile, resetPing };
}

export default connect(mapStateToProps, {
    updateUserData,
    setUserData,
    clearUserData
})(AuthLoadingScreen);

const innerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
});