import React from 'react';
import { StyleSheet } from 'react-native';
import { Label, View, Icon } from 'native-base';
import { Text } from '../common';

const LabelComponent = ({
  label,
  mandatory = false,
  blackTheme,
  showIcon,
  iconName
}) => {
  let labelStyle = innerStyles.labelStyle;
  if (blackTheme != undefined && blackTheme == true) {
    labelStyle = [innerStyles.labelStyle, { color: '#FFFFFF' }];
  }
  if (mandatory == undefined || mandatory == false) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Label style={labelStyle}>{label}</Label>
        {showIcon != undefined && showIcon == true && (
          <Icon
            style={[innerStyles.inputIcon, { fontSize: 25 }]}
            name={iconName}
          />
        )}
      </View>
    );
  } else {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Label style={labelStyle}>
          {label}
          <Text style={{ color: 'red' }}> *</Text>
        </Label>

        {showIcon != undefined && showIcon == true && (
          <Icon
            style={[innerStyles.inputIcon, { fontSize: 25, color: '#000000' }]}
            name={iconName}
          />
        )}
      </View>
    );
  }
};

const innerStyles = StyleSheet.create({
  labelStyle: {
    color: '#000',
    fontSize: 24,
    marginLeft: 0,
    fontFamily: fontBoldItalic,
    paddingBottom: 0,
    marginBottom: 0
  },
  inputIcon: {
    color: '#87939F',
    marginTop: 5,
    marginLeft: 10
  }
});
export { LabelComponent };
