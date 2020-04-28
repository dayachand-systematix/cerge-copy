/* eslint-disable global-require */
import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View, Image, Dimensions } from 'react-native';
import {
    SHOPPING, BROWSING, DND, ASSISTANCE, SHOPPINGLABEL, BROWSINGLABEL,
    DNDLABEL, ASSISTANCELABEL
} from '../../../constants';

const { width } = Dimensions.get('window');

export const ShoppingStatus = ({ focused }) => {
    const { userProfile: { shoppingStatus } } = useSelector(state => state.profile);
    const status = shoppingStatus && shoppingStatus != null ? shoppingStatus.shoppingStatus : 'N/A';
    let label = SHOPPINGLABEL;
    let image = require('../../../assets/images/ShoppingIcon.png');

    switch (status) {
        case SHOPPING:
            image = require('../../../assets/images/ShoppingIcon.png');
            label = SHOPPINGLABEL;
            break;
        case BROWSING:
            image = require('../../../assets/images/Browsing.png');
            label = BROWSINGLABEL;
            break;
        case DND:
            image = require('../../../assets/images/DND.png');
            label = DNDLABEL;
            break;
        case ASSISTANCE:
            image = require('../../../assets/images/Assistance.png');
            label = 'ASSISTANCE';
            break;
        default:
            image = require('../../../assets/images/ShoppingIcon.png');
            label = SHOPPINGLABEL;
            break;
    }
    let fontSize = 12;
    if(width < 500 && width > 400) {
        fontSize = 14;
    } else if (width > 500) {
        fontSize = 16;
    }
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }} >
            <Image
                source={image}
                style={{
                    width: 30,
                    height: 30,
                    marginTop: 6,
                }}
                resizeMode={'contain'}
            />
            <View
                style={{
                    borderBottomWidth: 3,
                    borderBottomColor: focused ? '#000000' : '#FFFFFF',
                    marginBottom: 5
                }}
            >
                <Text style={{ color: '#000000', fontSize: fontSize }}>{label.toUpperCase()}</Text>
            </View>
        </View>
    );
};
