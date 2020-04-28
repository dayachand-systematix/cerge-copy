import React from 'react';
import { Container, Content, Icon } from 'native-base';
import { connect } from 'react-redux';
import axios from 'axios';
import Permissions from 'react-native-permissions';
import { WebView } from 'react-native-webview';
//import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {
    View,
    ImageBackground,
    StyleSheet,
    Keyboard,
    Platform,
    PermissionsAndroid,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Linking
} from 'react-native';
import { InputBox, Loader, Text, HeaderContent, Button } from '../../common';
import {
    loginUserAPI,
    updateIntroStatus,
    hatSignup,
    hatLogin,
    hatLoginCallback,
    validateLoginUrl
} from '../../../actions/Auth';
import { getUserProfileAction } from '../../../actions/Profile';
import { LABELS } from '../../../languageConstants';
import { Toast, ValidationComponent } from '../../../helper';
import { MESSAGES, STATUS_CODES, API_VERSION_TEST } from '../../../config';
import AppIntroSlider from '../../common/AppIntroSlider';

const { width } = Dimensions;
const imageWidth = Dimensions.get('window').width - 10;
const imageHeight = (736 / 636) * imageWidth;
const slides = [
    {
        key: 'walkThrough1',
        title: LABELS.SLIDE_TITLE,
        image: require('../../../assets/images/WalkthroughScreen1.png'),
        text: LABELS.SLIDE_TEXT,
        imageStyle: {
            width: imageWidth,
            height: imageHeight,
            resizeMode: 'contain',
            flex: 0.53,
            marginBottom: 20,
        },
        textStyle: {
            color: '#000',
            fontSize: 17,
            width: width,
            left: 0,
        },
        titleStyle: {
            color: '#778389',
            fontSize: 25,
            width: width,
            textAlign: 'center',
            opacity: 1,
            marginTop: 20,
            fontFamily: fontBoldItalic,
        },
        backgroundColor: 'white'
    }
];

class Login extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isSubmitted: false,
            authToken: '',
            showWebView: false,
            hatSignupURL: '',
            hatLoginUrl: '',
            loading: false,
            isHatAccount: false,
            isDisabled: false,
            visible: false,
        };
    }

    componentWillMount() {
        this.props.updateIntroStatus();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isIntroShowed !== nextProps.isIntroShowed) {
            this.setState({ isIntroShowed: 'true' });
            this.props.updateIntroStatus();
        }
    }

    componentDidMount() {
        if (this.props.isIntroShowed !== 'true') {
            if (Platform.OS === 'ios') {
                Permissions.request('camera').then(response => {
                    if (response == 'authorized') {
                    }
                });

                Permissions.request('photo').then(response => {
                    if (response == 'authorized') {
                    }
                });
                Permissions.request('location').then(response => {
                    if (response == 'authorized') {
                    }
                });
            } else {
                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    ],
                    {
                        title: 'Alert',
                        message: 'We need your permission.'
                    }
                ).then(permRes => {
                    if (
                        permRes['android.permission.CAMERA'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                        permRes['android.permission.READ_EXTERNAL_STORAGE'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                        permRes['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                        permRes['android.permission.ACCESS_FINE_LOCATION'] ===
                        PermissionsAndroid.RESULTS.GRANTED
                    ) {
                    }
                });
            }
        }
    }

    /**
     * @method checkValidation
     *@description called to check validations
     */
    checkValidation = () => {
        /* Call ValidationComponent validate method */
        this.validate({
            email: {
                required: true,
                email: true
            }
        });
        this.setState({ error: true });
    };

    /**
     * @method forgetPassword
     * @description Navigate user to the forgetPassword screen
     */
    forgetPassword = () => {
        this.props.navigation.navigate('ForgetPassword');
    };

    /**
     * @method onInputValueChanged
     * @description called when input field value changes
     */
    onInputValueChanged = key => value => {
        const state = this.state;
        state[key] = value;
        state['isDisabled'] = true;
        this.setState(state, () => {
            if (this.state.isSubmitted) {
                this.checkValidation();
            }
        });
    };

    checkHatAccount = () => {
        Keyboard.dismiss();
        this.setState({ isSubmitted: true });
        this.checkValidation();
        const { email } = this.state;
        const formData = {
            email: email
        };
        if (this.isFormValid()) {
            this.setState({ loading: true });
            this.props.hatLogin(formData, res => {
                if (res && res.status == 200) {
                    const resData = res.data.data;
                    if (resData && resData.hatLoginUrl != '') {
                        this.props.validateLoginUrl(resData.hatLoginUrl, loginResponse => {
                            if (loginResponse.status == 200) {
                                Toast.showToast(MESSAGES.USER_REGESTERED, 'success');
                                this.setState({
                                    hatSignupURL: resData.hatLoginUrl,
                                    isHatAccount: true,
                                    loading: false,
                                    isDisabled: false,
                                });
                            } else {
                                Toast.showToast(MESSAGES.USER_NOT_REGESTERED, 'danger');
                                this.setState({
                                    loading: false,
                                    isHatAccount: false,
                                    isDisabled: false,
                                });
                            }
                        });
                    } else {
                        Toast.showToast('Something went wrong, Please try again.', 'danger');
                        this.setState({ loading: false, isHatAccount: false, isDisabled: false });
                    }
                } else {
                    Toast.showToast('Something went wrong, Please try again.', 'danger');
                    this.setState({ loading: false, isHatAccount: false, isDisabled: false });
                }
            });
        }
    }

    /*
     * @method onPressLoginButton
     * @description login takes user the app stack by setting isLoggedIn in AsncStorage
     */
    /*onPressLoginButton = async () => {
        Keyboard.dismiss();
        this.setState({ isSubmitted: true });
        this.checkValidation();
        const { email, isHatAccount } = this.state;
        const formData = {
            email
        };
        if (this.isFormValid()) {
            if (isHatAccount === true) {
                this.setState({
                    showWebView: true
                });
            } else {
                this.setState({ loading: true });
                this.props.hatSignup(formData, res => {
                    console.log('hatSignup res', res);
                    this.setState({ loading: false });
                    if (res && res.status == 200 && res.data.code == 200) {
                        Toast.showToast(MESSAGES.USER_NOT_REGESTERED, 'danger');
                        const resData = res.data.data;
                        this.setState({
                            hatSignupURL: resData.hatSignUpUrl,
                            showWebView: true
                        });
                    } else if (res && res.data.Code == 500) {
                        Toast.showToast('Email has been registered already.', 'danger');
                        this.checkHatAccount();
                    }
                });
            }


        }
    };*/

    onPressLoginButton = async () => {
        Keyboard.dismiss();
        this.setState({ isSubmitted: true });
        this.checkValidation();
        const { email } = this.state;
        const formData = {
            email: email
        };
        if (this.isFormValid()) {
            this.setState({ loading: true });
            this.props.hatLogin(formData, res => {
                console.log('ressss', res);
                if (res && res.status == 200) {
                    const resData = res.data.data;
                    if (resData && resData.hatLoginUrl != '') {
                        this.props.validateLoginUrl(resData.hatLoginUrl, loginResponse => {
                            console.log('loginResponse', loginResponse.status)
                            this.setState({ loading: false });
                            if (loginResponse.status == 200) {
                                this.setState({
                                    hatSignupURL: resData.hatLoginUrl,
                                    showWebView: true
                                });
                            } else {
                                //Toast.showToast(MESSAGES.USER_NOT_REGESTERED, 'danger');
                                this.setState({ loading: false });
                                this.props.hatSignup(formData, res => {
                                    if (res && res.status == 200) {
                                        let resData = res.data.data;
                                        this.setState({
                                            hatSignupURL: resData.hatSignUpUrl,
                                            showWebView: true
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        Toast.showToast('Something went wrong, Please try again.', 'danger');
                        this.setState({ loading: false });
                    }
                } else {
                    Toast.showToast('Something went wrong, Please try again.', 'danger');
                    this.setState({ loading: false });
                }
            });
        }
    };

    /*
     * @method : onAppIntroDone
     * @description: udating the isIntroShowed value to true on clicking done
     * by: Praful
     */
    onAppIntroDone = () => {
        // User finished the introduction. Show real app through
        AsyncStorage.setItem('ISINTROSHOWED', 'true').then(() => {
            this.props.updateIntroStatus();
        });
    };

    /*
     * @method : onAppIntroSkip
     * @description: on clicking user skip the walkthrough screen and land on login
     * by: Praful
     */
    onAppIntroSkip = () => {
        // User finished the introduction. Show real app through
        AsyncStorage.setItem('ISINTROSHOWED', 'true').then(() => {
            this.props.updateIntroStatus();
        });
    };

    /*
     * @method : renderSkipButton
     * @description: displaying the skip button on walkthrough screen
     * by: Praful
     */
    renderSkipButton = () => {
        return (
            <View style={innerStyle.buttonStyle}>
                <Text>{LABELS.SKIP}</Text>
                <Icon
                    name='md-arrow-round-forward'
                    color='rgba(255, 255, 255, .9)'
                    size={24}
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>
        );
    };

    renderDoneButton = () => {
        return (
            <ImageBackground
                source={require('../../../assets/images/loginFirst.png')}
                style={innerStyle.doneButton}
            >
                <View style={innerStyle.copyrightBox}>
                    <Text style={innerStyle.doneText}>{LABELS.GETSTARTED}</Text>
                </View>
            </ImageBackground>
        );
    };

    onMessage = event => {
        let reponseData = event.nativeEvent.data;
        if (
            reponseData &&
            (reponseData.includes('?token=') || reponseData.includes('?error='))
        ) {
            this.setState({ showWebView: false, loading: true });
            fetch(reponseData, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.text())
                .then(response => {
                    const jsonResponse = JSON.parse(response);
                    if (jsonResponse && jsonResponse.code && jsonResponse.code == STATUS_CODES.OK) {
                        this.setState(
                            { authToken: jsonResponse.token, loading: false },
                            () => {
                                Toast.showToast(MESSAGES.LOGGED_IN_SUCCESS, 'success');
                                AsyncStorage.setItem('isLoggedIn', 'true');
                                AsyncStorage.setItem('auth_token', jsonResponse.token).then(
                                    () => {
                                        this.setState({ loading: true });
                                        axios.defaults.headers.common.Token = jsonResponse.token;
                                        this.props.getUserProfileAction(res => {
                                            this.setState({ loading: false });
                                            if (res.status == 200) {
                                                if (res &&
                                                    res.data &&
                                                    res.data.data &&
                                                    res.data.data.userProfile
                                                ) {
                                                    const { userProfile } = res.data.data;
                                                    AsyncStorage.setItem('userProfile', JSON.stringify(userProfile)).then(
                                                        () => {
                                                            this.props.navigation.navigate('AuthLoading');
                                                        });
                                                } else {
                                                    this.props.navigation.navigate('AuthLoading');
                                                }
                                            }
                                        });
                                    }
                                );
                            }
                        );
                    } else {
                        Toast.showToast(jsonResponse.Description, 'danger');
                        this.setState({ loading: false });
                    }
                });
        }

        //this.setState({dataRes: event});
    };


    injectjs = () => {
        let jsCode = `
        setInterval(() => {
          var URL = window.location.href
           if(URL.includes('?token=') || URL.includes('?error=')) {
               //var jsonObj = document.getElementsByTagName('body')[0].innerText
               window.ReactNativeWebView.postMessage(URL);
           }
        }, 100);
    `;
        return jsCode;
    };

    openUrl = (url) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    console.log("Can't open link ");
                    Toast.showToast("Can't open link ", "danger");
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    }

    /**
     * @method render
     * @description used to render screen
     */
    render() {
        const { email, showWebView, hatSignupURL, isDisabled, visible } = this.state;
        if (showWebView) {
            return (
                <Container>
                    <StatusBar backgroundColor="rgba(255, 255, 255, 0)" barStyle="dark-content" hidden={false} />
                    <WebView
                        ref={webview => {
                            this.webview = webview;
                        }}
                        source={{
                            uri: hatSignupURL
                        }}
                        injectedJavaScript={this.injectjs()}
                        javaScriptEnabled
                        onMessage={e => this.onMessage(e)}
                        startInLoadingState
                        useWebKit
                        style={{ marginTop: getStatusBarHeight() }}
                    />

                </Container>
            );
        } else if (this.props.isIntroShowed !== 'true') {
            return (
                <AppIntroSlider onPressGetStartedButton={this.onAppIntroDone} />
                // <AppIntroSlider
                //     slides={slides}
                //     activeDotStyle={innerStyle.activeDotStyle}
                //     dotStyle={innerStyle.dotStyle}
                //     buttonStyle={innerStyle.buttonStyle}
                //     buttonTextStyle={innerStyle.buttonTextStyle}
                //     onDone={this.onAppIntroDone}
                //     //onSkip={this.onAppIntroSkip}
                //     renderDoneButton={this.renderDoneButton}
                //     bottomButton
                // />
            );
        } else {
            return (
                <Container>
                    <StatusBar backgroundColor="rgba(255, 255, 255, 0)" barStyle="dark-content" hidden={false} />
                    <Loader isLoading={this.state.loading} />
                    <HeaderContent
                        title={LABELS.WELCOME}
                        subTitle={LABELS.LOGIN_SUBTITLE}
                        blackTheme
                        showProfileSection={false}
                    />
                    <Content>
                        <View style={innerStyle.LoginWrapper}>
                            <InputBox
                                label={LABELS.EMAIL_LABEL}
                                mandatory
                                isDisabled={false}
                                maxLength={70}
                                onChangeText={this.onInputValueChanged('email')}
                                keyboardType={'email-address'}
                                iconName='mail'
                                IconSize={18}
                                value={email}
                                isFieldInError={this.isFieldInError('email')}
                                fieldErrorMessage={this.getErrorsInField('email')}
                            //onBlur={() => this.checkHatAccount()}
                            />
                            <Button
                                title={LABELS.NEXT}
                                //disabled={isDisabled}
                                onPress={() => this.onPressLoginButton()}
                            />
                            {/*  <Text style={{ color: '#000000' }}>{API_VERSION_TEST}</Text> */}
                        </View>


                        <View style={{marginTop: 20, marginRight: 15, marginLeft: 15}}>
                            <View>
                                <Text>
                                    We use Personal Data Accounts (PDAs) powered by the HAT Microserver technology to give you control and legal rights over your data. By proceeding to you agree to:
                                </Text>
                            </View>

                            <View style={{marginTop: 10}}>

                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('TermCondition')}>
                                    <Text style={{color: '#0076D9'}}>Cerge Terms of Service</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>this.openUrl('https://cdn.dataswift.io/legal/hat-owner-terms-of-service.pdf')}>
                                    <Text style={{color: '#0076D9'}}>HAT Terms of Service</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('PrivacyPolicy')}>
                                    <Text style={{color: '#0076D9'}}>Cerge Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{marginTop: 20, backgroundColor: '#F0F0F0', borderRadius: 10, padding: 10}}>
                                <TouchableOpacity style={{flexDirection: 'row', justifyContent:'space-between'}} onPress={()=>this.setState({visible: !visible})}>
                                    <View>
                                        <Text style={{color: '#222222'}}>
                                            Learn how we protect your data
                                        </Text>
                                    </View>
                                    <View style={{marginLeft: 10}}>
                                        <Icon style={{fontSize: 14, color: '#222222'}} name={visible?"ios-arrow-up":"ios-arrow-down"} />
                                    </View>

                                </TouchableOpacity>


                                {visible && <View style={{marginTop: 10}}>
                                    <Text>
                                        Your PDA enables you to own data rights for reuse and sharing with applications. For more information on PDAs,
                                        please visit
                                    </Text>

                                    <TouchableOpacity onPress={()=>this.openUrl('https://hubofallthings.com')}>
                                        <Text>https://hubofallthings.com</Text>
                                    </TouchableOpacity>
                                </View>}
                            </View>
                        </View>


                    </Content>
                </Container>
            );
        }
    }
}

const innerStyle = StyleSheet.create({
    LoginWrapper: {
        paddingTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%'
    },
    doneButton: {
        width: '100%',
        height: 55
    },
    copyrightBox: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    doneText: {
        fontSize: 20,
        color: '#000',
        marginTop: 13,
        fontFamily: fontRegular,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

/**
 * @method mapStateToProps
 * @description return state to component as props
 * @param {*} state
 */
function mapStateToProps({ auth }) {
    const { email, error, loading, isIntroShowed } = auth;
    return { email, error, loading, isIntroShowed };
}

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 */
export default connect(mapStateToProps, {
    loginUserAPI,
    updateIntroStatus,
    hatSignup,
    hatLogin,
    hatLoginCallback,
    validateLoginUrl,
    getUserProfileAction
})(Login);
