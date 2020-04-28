import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { H1, H2, H3 } from 'native-base';

/**
 * Heading Tag 
 * level props is difind the font size
 * level={1 or 2 or 3}
 */
export default class Heading extends Component {
    render() {
        switch (this.props.level) {
            case 1:
                return <H1 style={[innerStyle.H1, this.props.style]}>{this.props.children}</H1>;
                break;
            case 2:
                return <H2 style={[innerStyle.H2, this.props.style]}>{this.props.children}</H2>;
                break;
            case 3:
                return <H3 style={[innerStyle.H3, this.props.style]}>{this.props.children}</H3>;
                break;
            default:
                return <H1 style={[innerStyle.H1, this.props.style]}>{this.props.children}</H1>;
                break;
        }
    }
}

const innerStyle = StyleSheet.create({
    H1: {
        fontFamily: fontSemiBold,
        fontSize: 30,
        color: '#454F63'
    },
    H2: {
        fontFamily: fontSemiBold,
        fontSize: 24,
        color: '#454F63'
    },
    H3: {
        fontFamily: fontSemiBold,
        fontSize: 18,
        color: '#454F63'
    }
});
