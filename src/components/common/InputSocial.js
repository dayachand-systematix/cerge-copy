

import { Input as InputText, Item } from 'native-base';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class InputSocial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selection: null
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                selection: {
                    start: 0,
                    end: 0
                }
            });
        }, 300);
    }

    _onBlur = () => {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
        this.setState({
            selection: {
                start: 0,
                end: 0
            }
        });
    }

    _onFocus = () => {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
        let len = 0;
        if (this.props.value) {
            len = this.props.value.toString().length;
        }

        this.setState({
            selection: {
                start: len,
                end: len
            }
        }, () => {
            this.setState({ selection: null });
        });
    }

    render() {
        const { children, onBlur, mandatory, disabled = false, label, value, onChangeText, placeholder, secureTextEntry = false, isSubmitted = false, keyboardType, maxLength = 150, onSubmitEditing, onEndEditing, selection, iconName, IconSize } = this.props;
        let inputBoxStyle = innerStyles.textStyle;
        if (disabled != undefined && disabled == true) {
            inputBoxStyle = [innerStyles.textStyle, { backgroundColor: '#efefef', color: '#000' }];
        }
        return (
            <View style={innerStyles.itemWarpper}>
                <InputText
                    style={inputBoxStyle}
                    secureTextEntry={secureTextEntry}
                    placeholder={placeholder}
                    placeholderTextColor='rgba(135,147,159,0.6)'
                    autoCorrect={false}
                    value={value}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    maxLength={maxLength}
                    disabled={disabled}
                    autoCapitalize="none"
                    onSubmitEditing={onSubmitEditing}
                    onEndEditing={onEndEditing}
                    selection={this.state.selection}
                    onBlur={this._onBlur}
                    onFocus={this._onFocus}
                />
                {children}
            </View>
        );
    }
}

const innerStyles = StyleSheet.create({
    itemWarpper: {
        marginLeft: 0,
        flexDirection: 'row',
        width: '90%',
    },
    textStyle: {
        fontSize: 15,
        color: '#000',
        fontFamily: fontRegular,
        height: 45,
    },
    inputWarpper: {
        flexDirection: 'row',
    },
    inputIcon: {
        color: '#87939f',
    }
});
