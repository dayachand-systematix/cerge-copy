import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Switch } from 'native-base';
import { CustomIcon } from '../../utils/CustomIcon';
import Styles from '../../assets/styles';

class AssetsTile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            unionStatus: false,
        };
    }

    /**
      * @method onChangeUnionStatus
      * @description Used to change union status
      */

    onChangeUnionStatus = () => {
        this.setState({ unionStatus: !this.state.unionStatus });
    }

    render() {
        return (
            <View style={innerStyle.opportunityBox}>
                <View style={innerStyle.opportunityBoxTop}>
                    <View style={innerStyle.opportunityImageBox}>
                        <Image source={require('../../assets/images/Logo.png')} style={{ width: 50, height: 50, borderRadius: 50 / 2 }} />
                    </View>
                    <View style={innerStyle.opportunityDetailBox}>
                        <View style={innerStyle.opportunityBoxTop}>
                            <View style={Styles.row}>
                                <View style={innerStyle.halfItem}>
                                    <Text style={innerStyle.requesterName}>{this.props.siteName} </Text>
                                    <Text style={innerStyle.requesterName}>{this.props.assetName} </Text>
                                    <Text style={innerStyle.requesterName}>{this.props.remainingTime}</Text>
                                </View>
                                <View style={innerStyle.halfItem}>
                                    <CustomIcon style={innerStyle.iconStyles} name="about" />
                                </View>
                            </View>
                        </View>
                        <View style={innerStyle.profileTopContent}>
                            <View style={innerStyle.row}>
                                <Switch onValueChange={this.onChangeUnionStatus} value={this.state.unionStatus} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const innerStyle = StyleSheet.create({
    opportunityBox: {
        backgroundColor: '#fff',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 3
    },
    row: {
        flexDirection: 'row'
    },
    opportunityBoxTop: {
        flexDirection: 'row', padding: 10
    },
    opportunityImageBox: {
        width: '25%'
    },
    leftItemAlign: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    rightItemAlign: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    rowOnly: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    halfItem: {
        width: '50%',
    },
    iconStyles: {
        color: '#8c96a3', fontSize: 14, marginTop: 4
    },
    textStyle: {
        fontSize: 14, color: '#8c96a3'
    },

    requesterImg: {
        width: 70,
        height: 70,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#dce1ed',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.4,
        elevation: 10
    },
    opportunityDetailBox: {
        width: '75%',
    },
    columnHalfFirst: {
        flexDirection: 'row',
        width: '50%',
        justifyContent:
            'flex-start',
        alignItems: 'flex-start'
    },
    requesterTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    requesterName: {
        fontSize: 13,
        color: '#252723',
        fontWeight: '500',
        paddingRight: 15,
        width: 180,
        paddingLeft: 5
    },
    requestTime: {
        fontSize: 12, color: '#8893a0', marginTop: 4
    },
    requesterAddressNew: {
        marginTop: 10
    },
    requesterPicture: {
        width: 66, height: 66, borderRadius: 35
    },
    noProviderMsg: {
        height: deviceHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: -80,
        fontSize: 18
    },
    addRowInline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inlinelColmndmSmall: {
        width: 17, marginBottom: 5
    },
    addInlinelColmn: {
        textAlign: 'left',
        width: '91%',
        marginBottom: 5
    },
    profileImg: {
        width: 60,
        height: 45,
        borderRadius: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
        borderColor: '#fff',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    profileTopContent: {
        paddingBottom: 10, paddingLeft: 15, paddingRight: 15, paddingTop: 0,
    },
    switchLabel: {
        fontSize: 18, fontFamily: fontRegular, color: '#2C3138'
    },
});
export default AssetsTile;
