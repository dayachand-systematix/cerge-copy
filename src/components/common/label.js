import React from 'react';
import { Label, Text, Icon } from 'native-base';
import { View, TouchableOpacity } from 'react-native';

const LabelBox = ({
    iconName,
    label,
    value,
    isInline,
    ValColor,
    labColor,
    numberOfLines, onEditPress, isCurrency = false,
    alignRight = false, showEditIcon = false,
    large,
    medium,
    isBold = false,
}) => {

    let labelWrapper;
    let colon;
    let fontSize = 12;
    let iconFontSize = 12;
    if (isInline) {
        labelWrapper = inlineStyle.inlineLabelWrapper;
        colon = value && label ? ' : ' : '';
    }

    if (ValColor) {
        //inlineStyle.inputStyleTxt.color = ValColor;
    }

    if (large) {
        fontSize = 18;
        iconFontSize = 22;
    }
    if (medium) {
        fontSize = 15;
    }

    return (
        <View style={[labelWrapper, { justifyContent: alignRight ? 'flex-end' : 'flex-start' }]}>
            {iconName &&
                <Icon name={iconName} style={{ fontSize: iconFontSize, color: InputLabelColor, paddingRight: 5 }} />
            }
            <Label style={[inlineStyle.InputLabel, { fontWeight: isBold ? 'bold' : 'normal', textAlign: alignRight ? 'right' : 'left', color: labColor ? labColor : InputLabelColor, fontSize: fontSize }]}>{label}{colon}</Label>
            {showEditIcon &&
                <View style={{ flexDirection: 'row', justifyContent: alignRight ? 'flex-end' : 'flex-start', flex: (isInline && !alignRight) ? 1 : 0 }}>
                    <Text style={[inlineStyle.inputStyleTxt, { color: ValColor ? ValColor : labelColor, textAlign: alignRight ? 'right' : 'left', fontSize: fontSize, flex: (isInline && !alignRight) ? 1 : 0 }]} numberOfLines={numberOfLines}>{value}</Text>
                    <TouchableOpacity onPress={() => onEditPress()} style={{ marginLeft: 5, padding: 5 }}>
                        <Icon name={'md-create'} style={{ fontSize: fontSize, color: InputLabelColor }} />
                    </TouchableOpacity>
                </View>
                ||
                <Text style={[inlineStyle.inputStyleTxt, { color: ValColor ? ValColor : labelColor, textAlign: alignRight ? 'right' : 'left', fontSize: fontSize, flex: (isInline && !alignRight) ? 1 : 0 }]} numberOfLines={numberOfLines}>{value}</Text>
            }
        </View>
    );
}
export { LabelBox };

const inlineStyle = {
    inlineLabelWrapper: {
        flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'
    },
    InputLabel: {
        fontFamily: fontRegular, color: InputLabelColor, fontSize: 18
    },
    inputStyleTxt: {
        fontFamily: fontSemiBold, fontSize: 18, color: labelColor, paddingBottom: 0, flexWrap: 'wrap',
    }
}
