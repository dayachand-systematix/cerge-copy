import React from 'react';
import { useSelector } from 'react-redux';
import { Text } from 'react-native';

export const RetailerCounter = () => {
    const { acceptedRetailerListing } = useSelector(state => state.retailers);
    return (
        <Text
            style={{
                color: 'white',
                fontSize: 9,
                fontWeight: 'bold'
            }}
        >
            {acceptedRetailerListing.length}
        </Text>
    );
};
