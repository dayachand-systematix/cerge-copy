import React from 'react';
import { useSelector } from 'react-redux';
import { Text } from 'react-native';

export const InvitationCounter = () => {
    const { invitationListing } = useSelector(state => state.invitations);
    return (
        <Text
            style={{
                color: 'black',
                fontSize: 9,
                fontWeight: 'bold'
            }}
        >
            {invitationListing.length}
        </Text>
    );
};
