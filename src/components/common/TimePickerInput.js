import React from 'react';
import { View } from 'native-base';
import { StyleSheet, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { LabelComponent } from './LabelComponent';
import { CustomIcon } from '../../utils/CustomIcon';

const TimePickerInput = ({ date = '', disabled, mode, placeholder, format, label, mandatory, minTime, maxTime, onTimeChange, value, isSubmitted = false, isDisabled = false }) => {

  return (
    <View
      error={(value == '' && isSubmitted == true)}
      success={(!(value == '') && isSubmitted == true)} style={innerStyles.itemWarpper}
    >
      <View style={innerStyles.inputStyle}>
        <DatePicker
          date={date}
          mode={mode}
          showIcon={false}
          disabled={disabled}
          placeholder={placeholder}
          format={format}
          minDate={minTime}
          maxDate={maxTime}
          confirmBtnText="OK"
          cancelBtnText="CANCEL"
          onDateChange={onTimeChange}
          style={ innerStyles.timePickerStyle }
          customStyles={{
          dateInput: {borderWidth: 0},
          disabled:{ backgroundColor: '#fff' },
          placeholderText: { textAlign:'left', color: 'rgba(135,147,159,0.6)', fontSize: 14, fontFamily: fontRegular, paddingLeft: 0, fontSize:Platform.OS === 'ios' ? 18 : 14,},
          dateText: {fontSize: 16, fontFamily: fontRegular, paddingLeft: 2 },
          btnTextConfirm: { color: '#6E68B0' },
          }}
        />
        <CustomIcon style={innerStyles.calIcon} name='clock' />
      </View>
    </View>
  );
};
const innerStyles = StyleSheet.create({
  itemWarpper: {
    marginLeft: 0,
    marginBottom: 5,   
  },
  innerWrapper: {
    flexDirection: 'column'
  },
  inputStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
    marginBottom: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#C8CACC',
    padding: 13,
    paddingTop: 11,
    paddingBottom: 10,
    textAlign: 'left',
    width:'100%',
    height: 49

  },
  calIcon: {
    color: '#86929F',
    fontSize: 22
  },
  timePickerStyle:{
    position: 'absolute',
    width: '100%',
    zIndex: 3,
    left: 0,
    paddingTop:Platform.OS === 'ios' ? 4 : 0,
  },
});

export default TimePickerInput;
