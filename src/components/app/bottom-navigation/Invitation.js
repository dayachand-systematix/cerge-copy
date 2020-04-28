/* eslint-disable global-require */
import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { InvitationCounter } from '../invitations/InvitationCounter';


const { width } = Dimensions.get('window');

export const Invitation = ({ focused }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }} >
            <View style={{ position: 'absolute', top: 5, backgroundColor: 'red', borderRadius: 11, width: width > 400 ? 22 : 20, height: width > 400 ? 22 : 20, zIndex: 99, alignItems: 'center', justifyContent: 'center', right: width > 400 ? 12 : 4 }} >
                <InvitationCounter />
            </View>
            <Image
                source={require('../../../assets/images/Invitation.png')}
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
                <Text style={{ color: '#000000', fontSize: width > 400 ? 16 : 12 }}>INVITATIONS</Text>
            </View>
        </View>
    );
};
