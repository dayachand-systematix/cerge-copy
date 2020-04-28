/* eslint-disable global-require */
import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const ReviewAndRating = ({ focused }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }} >
            <Image
                source={require('../../../assets/images/Review.png')}
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
                <Text style={{ color: '#000000', fontSize: width > 400 ? 16 : 12 }}>REVIEWS</Text>
            </View>
        </View>
    );
};
