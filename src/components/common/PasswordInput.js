import { Input as InputText, Item, Icon, Button } from 'native-base';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Fonts } from '../../utils/Fonts';
import { LabelComponent } from './LabelComponent';
import { CustomIcon } from '../../utils/CustomIcon';
import Style from '../../assets/styles';
const renderEyeIcon = (secureTextEntry, onEyeClick, IconSize) => {
    if (onEyeClick == undefined) {
    } else {
        if (secureTextEntry) {
            return (
                <TouchableOpacity transparent onPress={onEyeClick} style={innerStyles.eyeIconCm}>
                    <Icon name='ios-eye-off' style={[innerStyles.eyeIcon, { fontSize: IconSize }]} />
                </TouchableOpacity>
            );
        }
        else {
            return (
                <TouchableOpacity transparent onPress={onEyeClick} style={innerStyles.eyeIconCm}>
                    <Icon name='ios-eye' style={[innerStyles.eyeIcon, { fontSize: IconSize }]} />
                </TouchableOpacity>
            );
        }
    }
}

export default class PasswordInput extends Component {
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
        const { placeholderTextColor, children, onBlur, mandatory, isDisabled = false, label, value, onEyeClick, onChangeText, placeholder, secureTextEntry, isSubmitted = false, keyboardType, maxLength = 150, onSubmitEditing, onEndEditing, selection, iconName, IconSize } = this.props
        const customWords = (secureTextEntry && secureTextEntry == true) ? '' : 'words';
        return (
            <View stackedLabel style={innerStyles.itemWarpper}>
                <LabelComponent label={label} mandatory={mandatory} />
                <Item style={innerStyles.inputWarpper}>
                    <InputText
                        style={innerStyles.textStyle}
                        secureTextEntry={secureTextEntry}
                        placeholder={placeholder}
                        placeholderTextColor={placeholderTextColor}
                        autoCorrect={false}
                        value={value}
                        keyboardType={keyboardType}
                        onChangeText={onChangeText}
                        maxLength={maxLength}
                        disabled={isDisabled}
                        autoCapitalize={customWords}
                        onSubmitEditing={onSubmitEditing}
                        onEndEditing={onEndEditing}
                        selection={this.state.selection}
                        onBlur={this._onBlur}
                        onFocus={this._onFocus}
                    />
                    {renderEyeIcon(secureTextEntry, onEyeClick, IconSize)}
                    {/* <CustomIcon style={[innerStyles.inputIcon, { fontSize: IconSize }]} name={iconName} /> */}
                    {children}
                </Item>
            </View>
        );
    }
}


const innerStyles = {
    itemWarpper: {
        marginLeft: 0,
        marginBottom: 10,
        paddingRight: 0
    },
    textStyle: {
        fontSize: 15,
        color: '#5A606C',
        fontFamily: fontRegular,
        marginBottom: 10,
        paddingLeft: 0
    },
    inputWarpper: {
        flexDirection: 'row',
        height: 50,
        borderBottomColor: '#738A9D',
        borderBottomWidth: 1,
        width: '100%',
        paddingRight: 0
    },
    inputIcon: {
        color: '#87939f',
    },
    eyeIcon: {
        color: '#87939f', fontSize: 18, textAlign: 'right'
    },
    eyeIconCm: {
        porition: 'relative',
        right: -7,
        width: 50,
        textAlign: 'right',
        paddingRight: 0
    }
};

