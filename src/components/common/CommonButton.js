import React from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import styles from '../../assets/styles';
import { Button, View } from 'native-base';
import { Text } from '../common';
/**
 * @method CommonButton
 * @description Display the common button for whole applicaiton 
 * @label
 */
const CommonButton = ({ label = 'Submit', onPress, dynamicBtnStyle = {}, dynamicBtnText = {} }) => {
  return (
    <View>
        <TouchableOpacity style={[styles.button, innerStyle.buttonShadow, dynamicBtnStyle]} onPress={onPress}>
          <Text style={[styles.buttonTextAuth, dynamicBtnText]}>{label}</Text>
        </TouchableOpacity>
    </View>
  );
};

const innerStyle = StyleSheet.create({
  buttonShadow: {
    shadowColor: '#fac700', elevation: 3,
  },
});
export default CommonButton;
