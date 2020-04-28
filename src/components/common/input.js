import {Input as InputText} from 'native-base';
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {LabelComponent} from './LabelComponent';
import {CustomIcon} from '../../utils/CustomIcon';
import {Text} from '../common';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: null,
    };
  }

  render() {
    const {
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
      selection,
      iconName,
      IconSize,
    } = this.props;
    let customWords = '';
    if (keyboardType === 'default') {
      customWords = 'sentences';
    } else if (keyboardType == 'email-address') {
      customWords = 'none';
    }

    let inputBoxStyle = innerStyles.textStyle;
    if (isDisabled != undefined && isDisabled == true) {
      inputBoxStyle = [innerStyles.textStyle, {paddingLeft: 0}];
    }
    return (
      <View stackedLabel style={[innerStyles.itemWarpper]}>
        <View style={innerStyles.inputWarpper}>
          <InputText
            style={inputBoxStyle}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor="rgba(135,147,159,0.6)"
            autoCorrect={false}
            value={value}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            maxLength={maxLength}
            disabled={isDisabled}
            autoCapitalize={customWords}
            onSubmitEditing={onSubmitEditing}
            onEndEditing={onEndEditing}
            underlineColorAndroid="transparent"
          />
          {children}
        </View>
        {this.props.isFieldInError && (
          <Text
            style={{
              fontSize: 13,
              color: 'red',
              marginTop: 5,
              fontFamily: fontSemiBold,
            }}>
            {this.props.fieldErrorMessage}
          </Text>
        )}
      </View>
    );
  }
}

const innerStyles = StyleSheet.create({
  itemWarpper: {
    marginLeft: 0,
  },
  textStyle: {
    fontSize: 15,
    fontFamily: fontRegular,
    textAlignVertical: 'top',
    height: 40,
  },
  inputWarpper: {
    borderWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    height: 40,
  },
  inputIcon: {
    color: '#87939F',
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: 16,
  },
});
