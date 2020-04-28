import React, { Component } from 'react';
import {
    View, ActivityIndicator
} from 'react-native';
import styles from '../../assets/styles';

/**
 * Advisable not to put this spinner inside native base content or some scrolling item
 */
export default class Spinner extends Component {
    render() {
        return (
            <View style={styles.loaderWrap}>
                <ActivityIndicator
                    size="large"
                    style={styles.loader}
                />
            </View>
        );
    }
}
