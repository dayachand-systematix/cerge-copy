/* eslint-disable global-require */
import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { RetailerCounter } from '../retailers/RetailerCounter';


const { width } = Dimensions.get('window');

export const Retailer = ({ focused }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }} >
            <View style={{ position: 'absolute', top: 5, backgroundColor: 'blue', borderRadius: 11, width: width > 400 ? 22 : 20, height: width > 400 ? 22 : 20, zIndex: 99, alignItems: 'center', justifyContent: 'center', right: width > 400 ? 2 : -5 }}>
                <RetailerCounter />
            </View>
            <Image
                source={require('../../../assets/images/Retailer.png')}
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
                <Text style={{ color: '#000000', fontSize: width > 400 ? 16 : 12 }}>ACCEPTED</Text>
            </View>
        </View>
    );
};
