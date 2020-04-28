import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StatusBar,
    Animated,
    Easing,
    AppState,
    Modal,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    NativeModules
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
const GeoLocationData = NativeModules.GeoLocation;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = '100%';

export default class NetWorkError extends Component {
    animation = new Animated.Value(0);
    static propTypes = {
        offlineText: PropTypes.string
    };

    animationConstants = {
        DURATION: 800,
        TO_VALUE: 4,
        INPUT_RANGE: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
        OUTPUT_RANGE: [0, -15, 0, 15, 0, -15, 0, 15, 0]
    };

    setNetworkStatus = status => {
        this.setState({ isConnected: status });
        if (status) {
            this.triggerAnimation();
        }
    };

    state = {
        isConnected: true
    };
    _handleAppStateChange = nextAppState => {
        console.log('nextAppState', nextAppState)
        if (nextAppState === "active") {
            NetInfo.isConnected.fetch().then(this.setNetworkStatus);
        }
    };
    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            this.setNetworkStatus
        );
        AppState.addEventListener("change", this._handleAppStateChange);
        this.animation = new Animated.Value(0);
    }
    componentWillUnmount() {
        this.stopTracking();
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.setNetworkStatus
        );
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    async stopTracking() {
        const authToken = await AsyncStorage.getItem('auth_token');
        GeoLocationData.checkInStore(authToken);
    }
    // Took Reference from https://egghead.io/lessons/react-create-a-button-shake-animation-in-react-native#/tab-code
    triggerAnimation = () => {
        this.animation.setValue(0);
        Animated.timing(this.animation, {
            duration: this.animationConstants.DURATION,
            toValue: this.animationConstants.TO_VALUE,
            useNativeDriver: true,
            ease: Easing.bounce
        }).start();
    };

    render() {
        const interpolated = this.animation.interpolate({
            inputRange: this.animationConstants.INPUT_RANGE,
            outputRange: this.animationConstants.OUTPUT_RANGE
        });
        const animationStyle = {
            transform: [{ translateX: interpolated }]
        };
        const { subMessage = 'You must connect to a Wi-Fi or mobile network, please check your connection', offlineText = "You are not connected to Internet" } = this.props;
        return !this.state.isConnected ? (
            <View style={{ backgroundColor: '#424242' }}>
                <StatusBar backgroundColor="#778389" />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={!this.state.isConnected}
                >
                    <View style={inlinestyle.container}>
                        <Image source={require('../../assets/images/no-connection.png')} style={{ height: 200, width: 200 }} />
                        <Text style={inlinestyle.textStyle}>{offlineText}</Text>
                        <Text style={inlinestyle.subTextStyle}>{subMessage}</Text>
                    </View>
                </Modal>
            </View>
        ) : null;
    }
}

const inlinestyle = StyleSheet.create({
    containerBackgroundColor: {
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', backgroundColor: '#ffffff',
    },
    textStyle: {
        fontSize: 25, color: '#4245f4', marginBottom: 5, marginTop: 20, textAlign: 'center'
    },
    subTextStyle: {
        fontSize: 20, color: '#000', alignSelf: 'center', textAlign: 'center', top: 20, width: '100%', height: 150
    }
});
