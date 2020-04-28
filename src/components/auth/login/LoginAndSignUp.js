import React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import { ValidationComponent } from '../../../helper';
import { InputBox, Loader, HeaderContent, Button } from '../../common';
import { loginUserAPI } from '../../../actions/Auth';
import { LABELS } from '../../../languageConstants';

class LoginAndSignUp extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isSubmitted: false,
      authToken: ''
    };
  }

  /**
   * @method checkValidation
   *@description called to check validations
   */
  checkValidation = () => {
    /* Call ValidationComponent validate method */
    this.validate({
      password: {
        required: true,
        maxlength: 25
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
        this.checkValidation();
      }
    });
  };

  /*
   * @method onPressLoginButton
   * @description login takes user the app stack by setting isLoggedIn in AsncStorage
   */
  onPressLoginButton = () => {
    Keyboard.dismiss();
    this.setState({ isSubmitted: true });
    //this.checkValidation();
    const { password } = this.state;
    const requestData = {
      password: password
    };
    if (this.isFormValid()) {
      this.props.navigation.navigate('App');
    }
  };

  onPressSignupButton = () => {
    this.props.navigation.navigate('HatAccount');
  };

  /**
   * @method render
   * @description used to render screen
   */
  render() {
    const { password } = this.state;
    return (
      <Container>
        <Loader isLoading={this.props.loading} />
        <HeaderContent
          title={LABELS.WELCOME}
          subTitle={LABELS.LOGIN_SUBTITLE}
          blackTheme
          showProfileSection={false}
        />
        <Content>
          <View style={innerStyle.LoginWrapper}>
            <InputBox
              label='Your password'
              mandatory
              isDisabled={false}
              maxLength={70}
              onChangeText={this.onInputValueChanged('password')}
              keyboardType={'email-address'}
              iconName='eye'
              IconSize={18}
              value={password}
              isFieldInError={this.isFieldInError('password')}
              fieldErrorMessage={this.getErrorsInField('password')}
            />
            <Button
              title={'SIGNUP'}
              onPress={() => this.onPressSignupButton()}
            />
            <Button title={'LOGIN'} onPress={() => this.onPressLoginButton()} />
          </View>
        </Content>
      </Container>
    );
  }
}

const innerStyle = StyleSheet.create({
  LoginWrapper: {
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%'
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
export default connect(
  mapStateToProps,
  { loginUserAPI }
)(LoginAndSignUp);
