import React, { Component } from 'react';
import { Input as InputText, Icon } from 'native-base';
import { View, StyleSheet, Platform } from 'react-native';
import { LabelComponent } from './LabelComponent';
import { Text } from '../common';
import ArrowButton from './ArrowButton';

export default class InputBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: null
    };
  }

  render() {
    const {
      blackTheme = false,
      children,
      mandatory,
      isDisabled = false,
      label,
      value,
      onChangeText,
      placeholder,
      secureTextEntry = false,
      isSubmitted = false,
      keyboardType = 'default',
      maxLength = 150,
      onSubmitEditing,
      onEndEditing,
      onBlur,
      selection,
      iconName,
      IconSize,
      imageNavigation
    } = this.props;

    let customWords = '';
    if (keyboardType === 'default') {
      customWords = 'sentences';
    } else if (keyboardType == 'email-address') {
      customWords = 'none';
    }

    let inputBoxStyle = innerStyles.textStyle;
    if (isDisabled != undefined && isDisabled == true) {
      inputBoxStyle = [
        innerStyles.textStyle,
        { backgroundColor: '#000000', paddingLeft: 0 }
      ];
    }
    if (blackTheme != undefined && blackTheme == true) {
      inputBoxStyle = [innerStyles.textStyle, { color: '#FFFFFF' }];
    }

    if (
      blackTheme != undefined &&
      blackTheme == true &&
      imageNavigation != undefined
    ) {
      inputBoxStyle = [innerStyles.textStyle, { color: '#000000' }];
    }
    let inputWarpper = innerStyles.inputWarpper;
    let placeHolderTextColor = imageNavigation == undefined ? 'rgba(255,255,255, 0.5)' : 'rgba(0,0,0,0.5)';
    if (this.props.isFieldInError != undefined && this.props.isFieldInError) {
      inputWarpper = [innerStyles.inputWarpper, { borderBottomColor: 'red' }];
      inputBoxStyle = [innerStyles.textStyle, { color: 'red' }];
      placeHolderTextColor= 'rgba(242, 38, 19, 0.5)';
    }
    return (
      <View stackedLabel style={[innerStyles.itemWarpper]}>
        <LabelComponent
          label={label}
          mandatory={mandatory}
          blackTheme={blackTheme}
        />
        <View
          style={
            imageNavigation != undefined
              ? innerStyles.inputImageWarpper
              : inputWarpper
          }
        >
          <InputText
            style={inputBoxStyle}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor={placeHolderTextColor}
            autoCorrect={false}
            value={value}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            maxLength={maxLength}
            disabled={isDisabled}
            autoCapitalize={customWords}
            onSubmitEditing={onSubmitEditing}
            onEndEditing={onEndEditing}
            onBlur={onBlur}
            underlineColorAndroid='transparent'
          />
          {imageNavigation == undefined && iconName != undefined && (
            <Icon
              style={[innerStyles.inputIcon, { fontSize: IconSize }]}
              name={iconName}
            />
          )}
          {imageNavigation != undefined && (
            <ArrowButton onPress={imageNavigation} />
          )}
          {children}
        </View>
        {/* {this.props.isFieldInError && (
          <Text
            style={{
              fontSize: 13,
              color: 'red',
              marginTop: 5,
              fontFamily: fontSemiBold
            }}
          >
            {this.props.fieldErrorMessage}
          </Text>
        )} */}
      </View>
    );
  }
}

const innerStyles = StyleSheet.create({
  itemWarpper: {
    marginLeft: 0,
    marginBottom: 15,
  },
  textStyle: {
    fontSize: 15,
    color: '#000000',
    fontFamily: fontRegular,
    marginBottom: 0,
    textAlignVertical: 'top',
    paddingLeft: 0
  },
  inputWarpper: {
    flexDirection: 'row',
    borderBottomColor: '#738A9D',
    borderBottomWidth: 1,
    height: 40,
    paddingBottom: 8,
    paddingTop: Platform.OS === 'ios' ? 2 : 8,
    marginLeft: 2,
  },
  inputImageWarpper: {
    flexDirection: 'row',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF'
  },
  inputIcon: {
    color: '#87939F',
    marginTop: Platform.OS === 'ios' ? 12 : 8
  }
});
