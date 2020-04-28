import React from 'react';
import { View } from 'native-base';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { LabelComponent } from './LabelComponent';
import { Text } from '../common';

const DatePickerInput = ({
  date = '',
  disabled,
  mode,
  placeholder,
  format,
  label,
  mandatory = false,
  minDate,
  maxDate,
  onDateChange,
  value,
  isSubmitted = false,
  blackTheme = false,
  isFieldInError = false,
  fieldErrorMessage,
  iconName,
  showIcon = false
}) => {
  let inputStyle = innerStyles.inputStyle;
  let placeHolderText = [innerStyles.placeHolderText, { color: blackTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }];
  if (isFieldInError != undefined && isFieldInError) {
    inputStyle = [innerStyles.inputStyle, { borderBottomColor: 'red' }];
    placeHolderText = [innerStyles.placeHolderText, { color: 'rgba(242, 38, 19, 0.5)' }];
  }
  return (
    <View
      error={value == '' && isSubmitted == true}
      success={!(value == '') && isSubmitted == true}
      style={innerStyles.itemWarpper}
    >
      <LabelComponent
        label={label}
        mandatory={mandatory}
        blackTheme={blackTheme}
        iconName={iconName}
        showIcon={showIcon}
      />
      <View style={inputStyle}>
        <DatePicker
          date={date}
          mode={mode}
          showIcon={false}
          disabled={disabled}
          placeholder={placeholder}
          format={format}
          minDate={minDate}
          maxDate={maxDate}
          confirmBtnText='OK'
          cancelBtnText='CANCEL'
          onDateChange={onDateChange}
          style={{
            position: 'absolute',
            width: '100%',
            zIndex: 3,
            /*  color: blackTheme ? '#FFFFFF' : '#000000' */
          }}
          customStyles={{
            dateInput: {
              borderWidth: 0,
              borderBottomWidth: 0,
              alignItems: 'flex-start',
              marginRight: 0,
              color: blackTheme ? '#FFFFFF' : '#000000'
            },
            disabled: {
              backgroundColor: '#000000'
            },
            placeholderText: [placeHolderText],
            dateText: {
              fontSize: 14,
              fontFamily: fontRegular,
              paddingLeft: 2,
              color: blackTheme ? '#FFFFFF' : '#000000'
            },
            btnTextConfirm: {
              color: '#FFC30D'
            }
          }}
        />
        {/* {isFieldInError && (
          <Text
            style={{
              fontSize: 13,
              color: 'red',
              marginTop: 68,
              fontFamily: fontSemiBold
            }}
          >
            {fieldErrorMessage}
          </Text>
        )} */}
      </View>
    </View>
  );
};

const innerStyles = StyleSheet.create({
  itemWarpper: {
    marginLeft: 0,
    marginBottom: 15
  },
  innerWrapper: {
    flexDirection: 'column'
  },
  inputStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 34,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#738A9D',
    position: 'relative',
    marginBottom: 15,
    color: '#FFFFFF'
  },
  calIcon: {
    color: '#919ba7',
    fontSize: 17
  },
  placeHolderText: {
    fontSize: 14,
    fontFamily: fontRegular,
    paddingLeft: 0
  }
});

export default DatePickerInput;
