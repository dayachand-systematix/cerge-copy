import React, { PureComponent, Component } from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Platform } from 'react-native';
import styles from '../../assets/styles';

/**
 * Display organisation image
 */
export default class OrganisationImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            noImage: false
        };
    }


    componentDidMount() {
        this.setState({ loader: false, noImage: false });
    }

    onLoadStart = () => {
        this.setState({ loader: true });
    };

    onEnd = () => {
        this.setState({ loader: false });
    };

    onError = (error) => {
        this.setState({ loader: false, noImage: true });
    };

    render() {
        let imagePath = (this.state.noImage == false) ? { uri: this.props.source } : require('../../assets/images/no-image-gray.png');
        return (
            <View>
                {this.state.loader &&
                    <ActivityIndicator style={styles.loaderImg} animating={true} size='large' color='#000' />
                }
                {(this.props.imageId) ?
                    <Image
                        // source={(this.state.noImage == false) ? { uri: this.props.source } : require('../../assets/images/no-image-gray.png')}
                        source={{ uri: this.props.source }}
                        onLoadStart={this.onLoadStart}
                        onLoad={this.onEnd}
                        onError={this.onError}
                        style={this.props.style ? this.props.style : innerStyle.userImg}
                    />
                    :
                    <Image
                        source={require('../../assets/images/no-image-gray.png')}
                        style={this.props.style ? this.props.style : innerStyle.userImg}
                    />
                }
            </View>
        );
    }
}
const innerStyle = StyleSheet.create({
    userImg: {
        width: Platform.OS === 'ios' ? 33 : 30,
        height: Platform.OS === 'ios' ? 33 : 30,
        borderRadius: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
