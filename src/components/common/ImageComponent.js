import React, { Component } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import styles from '../../assets/styles';
import { Text } from '../common';
/**
 * Advisable not to put this spinner inside native base content or some scrolling item
 */
export default class ImageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
        };
    }

    onLoad = () => {
        this.setState({ loader: true }, () => {
        });
    };
    onEnd = () => {
        this.setState({ loader: false }, () => {
        });
    };

    render() {
        return (
            <View>
                {this.state.loader &&
                    <ActivityIndicator style={styles.loaderImg} animating={true} size='large' color='#FFC30D' />
                }
                <Image
                    style={this.props.style}
                    source={(this.props.source) ? { uri: this.props.source } : require('../../assets/images/no-image-gray.png')}
                    onLoadStart={this.onLoad}
                    onLoadEnd={this.onEnd}
                />
            </View>
        );
    }
}
