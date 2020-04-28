import React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import { ValidationComponent, Toast } from '../../../helper';
import { HeaderComponent, InputBox, Loader, CommonButton } from '../../common';
import { forgotPasswordAPI } from '../../../actions/Auth';
import { MESSAGES } from '../../../config';

class ForgetPassword extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isSubmitted: false
        };
    }

    /**
     * @method checkValidation
     * @description called to check validations
     */
    checkValidation = () => {
        /* Call ValidationComponent validate method */
        this.validate({
            email: {
                required: true,
                email: true,
            }
        });
        this.setState({ error: true });
    }

    /**
     * @method onInputValueChanged
     * @description called when input field value changes
     */
    onInputValueChanged = (key) => (value) => {
        const state = this.state;
        state[key] = value;
        this.setState(state, () => {
            if (this.state.isSubmitted) {
                this.checkValidation();
            }
        });
    }

    /**
     * @method onPressConfirmButton
     * @description use to call forgot password api
     */

    onPressConfirmButton = () => {
        Keyboard.dismiss();
        const { email } = this.state;
        this.setState({ isSubmitted: true });
        this.checkValidation();
        const requestData = {
            email
        };
        if (this.isFormValid()) {
            this.props.forgotPasswordAPI(requestData, (res) => {
                /** if there is status in not equal to 200 then show error message  */
                if (res.status !== 200) {
                    Toast.showToast(MESSAGES.INVALID_EMAIL, 'danger');
                } else {
                    /** else status is 200 then redirect to login screen with success message */
                    Toast.showToast(MESSAGES.RESET_PASSWORD, 'success');
                    this.props.navigation.navigate('Login');
                }
            });
        }
    }

    /**
     * @method render
     * @description used to render screen
     */
    render() {
        return (
            <Container>
                <Loader isLoading={this.props.loading} />
                <HeaderComponent
                    title='Forgot Password'
                    leftButton='back'
                    isTransparent='true'
                />
                <Content>
                    {/* <View style={innerStyle.logoWrapper}>
                            <ImageBox
                                source={require('../../../assets/images/Logo-login.png')}
                                width={580}
                                height={316}
                                minWidthFromWindow={60}
                                autoResize={true}
                            />
                        </View> */}
                    <View style={innerStyle.LoginWrapper}>
                        <View style={innerStyle.LoginWrapperInner}>
                            <InputBox
                                label='Email Address'
                                mandatory={true}
                                isDisabled={false}
                                maxLength={70}
                                keyboardType={'email-address'}
                                onChangeText={this.onInputValueChanged('email')}
                                iconName='mail'
                                IconSize={18}
                                isFieldInError={this.isFieldInError('email')}
                                fieldErrorMessage={this.getErrorsInField('email')}
                            />
                            <View style={[innerStyle.btnRow, innerStyle.btnBox]}>
                                <CommonButton success block label='CONFIRM' onPress={() => this.onPressConfirmButton()} />
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const innerStyle = StyleSheet.create({
    pageBg: {
        flex: 1,
        resizeMode: 'cover',
    },
    logoWrapper: {
        marginTop: 50,
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
    },
    LoginWrapper: {
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: 'transparent',
    },
    LoginWrapperInner: {
        backgroundColor: '#fff',
        padding: 20,
        position: 'relative',
        zIndex: 9,
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
    btnBox: {
        marginLeft: 0,
        paddingLeft: 0,
        paddingRight: 0
    },
    btnRow: {
        margin: 20,
        marginBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        position: 'relative',
        zIndex: 99,
        paddingBottom: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 2,
        width: '100%'
    },
});

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
export default connect(mapStateToProps, { forgotPasswordAPI })(ForgetPassword);

