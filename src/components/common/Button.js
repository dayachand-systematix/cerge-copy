import React, { PureComponent } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Text } from '../common';

class Button extends PureComponent {
    render() {
        const props = this.props;
        return (
            <TouchableOpacity disabled={(props.disabled && props.disabled === true)? true : false} style={{paddingTop: 10}} onPress={props.onPress}>
                <ImageBackground source={require('../../assets/images/loginFirst.png')} style={innerStyle.footerLogo}>
                    <View style={innerStyle.copyrightBox}>
                        <Text style={innerStyle.copyrightText}>{props.title}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }
}

const innerStyle = StyleSheet.create({
    footerLogo: {
        width: '100%',
        height: 65
    },
    copyrightBox: {
        alignItems: 'center',
        paddingBottom: 20
    },
    copyrightText: {
        fontSize: 20,
        color: '#000',
        marginTop: 18,
        fontFamily: fontRegular,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10,
    },
});

export default withNavigation(Button);
