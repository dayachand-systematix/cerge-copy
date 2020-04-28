import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { Container, Content, Button } from 'native-base';
import { connect } from 'react-redux';
import { ValidationComponent, Toast } from '../../../helper';
import styles from '../../../assets/styles';
import { HeaderComponent, InputBox, Loader } from '../../common';
import { verifyOtpAPI, resendOtpAPI } from '../../../actions/Auth';
import { MESSAGES } from '../../../config';


class UserVerification extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            enteredVerificationToken: '',
            isSubmitted: false,
        };
    }


    /**
    * @method checkValidation
    * @description called to check validations
    */
    checkValidation = () => {
        /* Call ValidationComponent validate method */
        this.validate({
            enteredVerificationToken: {
                required: true,
            },

        });
        this.setState({ error: true });
    }

    /**
        * @method onInputValueChanged
        * @description called when input field value changes
        */
    onInputValueChanged = (key) => (value) => {
        this.changeValue(key, value);
    }
    /**
       * @method onValueChanged
       * @description called
       */
    onValueChanged = (key, value) => () => {
        this.changeValue(key, value);
    }

    /**
     * @method changeValue
     * @description called
     */
    changeValue = (key, value) => {
        const state = this.state;
        state[key] = value;
        this.setState(state, () => {
            if (this.state.isSubmitted) {
                this.checkValidation();
            }
        });
    }

    /**
     * @method onPressVerifyButton
     * @description Call verify token api
     */

    onPressVerifyButton = () => {
        const { navigation } = this.props;
        const userData = navigation.getParam('userData');
        this.setState({ isSubmitted: true });
        this.checkValidation();
        if (this.getErrorMessages()) {

        } else {
            const { enteredVerificationToken } = this.state;
            const formData = {
                username: userData.email,
                password: userData.password,
                verificationToken: enteredVerificationToken,
                registrationType: 'mobile'
            };
            this.props.verifyOtpAPI(formData, (response) => {
                if (response.status == 200) {
                    if (response.data.success != false) {
                        this.setState({ isSubmitted: false });
                        Toast.showToast(MESSAGES.VERIFICATION_SUCCESS, 'success');
                        this.props.navigation.navigate('Login');
                    } else {
                        Toast.showToast(response.data.message, 'danger');
                        this.setState({ isSubmitted: false });
                    }
                } else {
                    Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                    this.setState({ isSubmitted: false });
                }

            });
        }
    }

    onResendVerificationCode = () => {
        const { navigation } = this.props;
        const userData = navigation.getParam('userData');
        const formData = {
            email: userData.email,
            registrationType: 'mobile'
        };
        this.props.resendOtpAPI(formData, (response) => {

            if (response.data.success != false) {
                this.setState({ isSubmitted: false });
                Toast.showToast(response.data.message, 'success');
            } else {
                this.setState({ isSubmitted: false, isResend: false, enteredVerificationToken: '' });
                Toast.showToast(MESSAGES.RESEND_VARIFICATION_CODE_FAIL, 'danger');
            }
        });
    }


    /**
     * @method render
     * @description Renders component
     */
    render() {
        return (
            <Container>
                {this.props.loading && (
                    <Loader />
                )
                }
                <Content>
                    <ImageBackground source={require('../../../assets/images/login-bg.jpg')} style={innerStyle.pageBg}>
                        <HeaderComponent
                            title='Verify Token'
                            leftButton=''
                            isTransparent='false'
                        />
                        <View style={innerStyle.outerLoginWrap}>
                            <View style={innerStyle.logoWrapper}>
                                <Image source={require('../../../assets/images/Logo-login.png')} style={innerStyle.pageLogo} />
                            </View>
                            <View style={innerStyle.LoginWrapper}>
                                <View style={innerStyle.LoginWrapperInner}>
                                    <InputBox
                                        label="Verification Code"
                                        mandatory={true}
                                        isDisabled={false}
                                        maxLength={5}
                                        onChangeText={this.onInputValueChanged('enteredVerificationToken')}
                                        value={this.state.enteredVerificationToken}
                                        style={innerStyle.loginInputStyle}
                                        keyboardType='numeric'
                                        secureTextEntry={true}
                                        textAlign={'center'}
                                    //placeholder={'00000'}
                                    />
                                    {this.isFieldInError('enteredVerificationToken') && <Text style={styles.errorTextStyle}>{this.getErrorsInField('enteredVerificationToken')}</Text>}
                                </View>
                                <View style={innerStyle.btnRow}>
                                    <TouchableOpacity success block style={[styles.button, styles.btnCstm, styles.buttonFull, innerStyle.buttonShadow]}
                                        onPress={this.onPressVerifyButton}
                                    >
                                        <Text style={styles.buttonTextAuth}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={this.onResendVerificationCode}>
                                    <Text style={innerStyle.textAlignCenter}> Resend Token </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

const innerStyle = StyleSheet.create({
    pageBg: {
        flex: 1,
        width: null,
        height: 700,
        resizeMode: 'contain',
    },
    pageLogo: {
        width: 250, height: 250
    },
    logoWrapper: {
        marginTop: -20, alignItems: 'center', position: 'relative', zIndex: 2
    },
    socialWrapper: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    socialIcon: {
        width: 100, height: 100
    },
    middleIcon: {
        marginLeft: -30, marginRight: -30
    },
    LoginWrapper: {
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: 'transparent',
        marginTop: -140,
    },
    LoginWrapperInner: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 140,
        position: 'relative',
        zIndex: 9,
        paddingBottom: 50,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    buttonShadow: {
        shadowColor: '#fac700', elevation: 3
    },
    btnRow: {
        margin: 20,
        marginTop: -30,
        paddingLeft: 10,
        paddingRight: 10,
        zIndex: 99,
        paddingBottom: 10,
        position: 'relative',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    InputValue: {
        marginTop: 0, color: '#2C3138',
    },
    itemLabel: {
        borderBottomColor: '#738A9D'
    },
    InputLabel: {
        fontFamily: fontRegular, fontSize: 19, color: '#87939F', height: 'auto', lineHeight: 19
    },
    forgotLink: {
        width: '100%', paddingTop: 20, textAlign: 'center', fontFamily: fontRegular, color: '#8892a1', fontSize: 16
    },
    loginInputWrapperStyle: { fontSize: 14, position: 'relative', padding: 10 },
    loginInputStyle: { fontSize: 14, letterSpacing: 30, borderBottomWidth: 1, borderStyle: 'solid', borderBottomColor: '#738A9D' },
    textAlignCenter: {
        textAlign: 'center',
        color: '#888'
    }
})
/**
* @method mapStateToProps
* @description return state to component as props
* @param {*} state
*/
function mapStateToProps({ auth }) {
    const { email, error, loading, } = auth;
    return { email, error, loading };
}


/**
 * @method connect
 * @description connect with redux
* @param {function} mapStateToProps
* @param {function} mapDispatchToProps
                        */
export default connect(
    mapStateToProps,
    { verifyOtpAPI, resendOtpAPI }
)(UserVerification);

