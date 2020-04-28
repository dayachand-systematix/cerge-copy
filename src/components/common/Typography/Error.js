import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import LineText from './LineText';

/**
 * Error Tag 
 * style props is defind the text 
 * Filed Error
 */
export default class Error extends Component {
    render() {
        return <LineText style={[innerStyle.error, this.props.style]} color={'red'} size={'smallx'}>{this.props.children}</LineText>
    }
}

const innerStyle = StyleSheet.create({
    error: {
        marginTop: 5,
    }
});
