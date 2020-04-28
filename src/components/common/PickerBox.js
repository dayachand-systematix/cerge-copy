import React from 'react';
import { Item, Picker } from 'native-base';
import { View, StyleSheet } from 'react-native';
import { LabelComponent } from './LabelComponent';
import { Text } from '../common';
const PickerBox = ({ style, itemStyle, iosIcon, mode = 'dropdown', renderHeader, placeholder, iosHeader, headerStyle, itemTextStyle, supportedOrientations, headerBackButtonText, headerBackButtonStyle, placeholderIconColor, mandatory, onValueChange, renderDropdownValues, optionArray, value, labelTxt, isSubmitted = false, enabled = true }) => {
	return (
		<View
			style={innerStyel.itemWarpper}
			error={(value == '' && isSubmitted == true)}
			success={(!(value == '') && isSubmitted == true)}
		>
			<LabelComponent
				label={labelTxt}
				mandatory={mandatory}
			/>
			<Item style={innerStyel.inputWarpper}>
				<Picker
					style={[{ fontSize: 14, paddingLeft: 0 }, style]}
					isSubmitted={isSubmitted}
					selectedValue={value}
					value={value}
					onValueChange={onValueChange}
					enabled={enabled}
					iosIcon={iosIcon}
					mode={mode}
					placeholderIconColor={placeholderIconColor}
					renderHeader={renderHeader}
					placeholder={placeholder}
					placeholderStyle={innerStyel.placeholderStyle}
					iosHeader={iosHeader}
					headerStyle={headerStyle}
					textStyle={{ fontFamily: fontRegular, fontSize: 14, paddingLeft: 0 }}
					itemTextStyle={{ ...itemTextStyle, fontSize: 14 }}
					itemStyle={{ ...itemStyle, fontSize: 14 }}
					supportedOrientations={supportedOrientations}
					headerBackButtonText={headerBackButtonText}
					headerBackButtonStyle={headerBackButtonStyle}
				>
					{_.map(optionArray, (val, i) => {
						return (
							<Picker.Item key={i} value={val.value} label={val.label} />
						);
					})}
				</Picker>
			</Item>
			<Text>
				{value == '' && isSubmitted == true && (
					<Text style={innerStyel.errorTextStyle}> Required</Text>
				)}
			</Text>
		</View>
	);

};

const innerStyel = StyleSheet.create({
	itemWarpper: {
		marginLeft: 0,
		marginBottom: 5
	},
	textStyle: {
		fontSize: 14,
		color: '#2C3138',
		fontFamily: fontRegular,
		width: '100%',
		paddingLeft: 0,
		paddingRight: 0,
	},
	inputWarpper: {
		flexDirection: 'row',
		borderBottomColor: '#738A9D',
		borderBottomWidth: 1,
	},
	errorTextStyle: {
		fontSize: 14,
		marginLeft: 0,
		marginRight: 15,
		color: 'red',
		fontFamily: fontRegular
	},
	placeholderStyle: {
		color: '#2C3138',
		fontSize: 14,
		padding: 0
	}
});

export default PickerBox;
