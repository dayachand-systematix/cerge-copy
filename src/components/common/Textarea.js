import { Input as InputText, Item, Text } from 'native-base';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { LabelComponent } from './LabelComponent';
import { CustomIcon } from '../../utils/CustomIcon';


export default class Textarea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selection: null,
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
        const { placeholderTextColor, children, onBlur, mandatory, isDisabled = false, label, value, onChangeText, placeholder, secureTextEntry, isSubmitted = false, keyboardType, maxLength = 501, onSubmitEditing, onEndEditing, selection, numberOfLines, multiline = true, iconName, IconSize } = this.props;
        return (
            <View stackedLabel style={[innerStyles.itemWarpper]}>
                <LabelComponent label={label} mandatory={mandatory} />
                <Item style={innerStyles.inputWarpper}>
                    <InputText
                        style={innerStyles.textStyle}
                        secureTextEntry={secureTextEntry}
                        placeholder={placeholder}
                        placeholderTextColor='rgba(135,147,159,0.6)'
                        autoCorrect={false}
                        value={value}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        keyboardType={keyboardType}
                        onChangeText={onChangeText}
                        maxLength={maxLength}
                        disabled={isDisabled}
                        onSubmitEditing={onSubmitEditing}
                        onEndEditing={onEndEditing}
                        returnKeyType='done'
                        returnKeyLabel='return'
                        blurOnSubmit={true}
                    />
                    <CustomIcon style={[innerStyles.inputIcon, { fontSize: IconSize }]} name={iconName} />
                    {children}
                </Item>
                {
                    this.props.isFieldInError &&
                    <Text style={{
                        fontSize: 13,
                        color: 'red',
                        marginTop: 5,
                        fontFamily: fontSemiBold,
                    }}>{this.props.fieldErrorMessage}</Text>
                }
            </View>
        );
    }
}

const innerStyles = StyleSheet.create({
    itemWarpper: {
        marginLeft: 0,
        marginBottom: 15
    },
    textStyle: {
        fontSize: 14,
        color: '#040605',
        fontFamily: fontRegular,
        marginBottom: 0,
        textAlignVertical: 'top',
        paddingLeft: 0,
    },
    inputWarpper: {
        flexDirection: 'row',
        borderBottomColor: '#738A9D',
        borderBottomWidth: 1,
        paddingTop: 0,
        paddingLeft: 0,
        height: 60,
        marginBottom: 0,
        paddingBottom: 2,
        paddingRight: 0
    },
    inputIcon: {
        color: '#87939F',
    },
});
