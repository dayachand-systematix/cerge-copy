import React, { Component } from 'react';
import {
    View, Image, StyleSheet, TouchableOpacity, Modal
} from 'react-native';
import { ImageComponent, Text } from '../common';
/**
 * Advisable not to put this spinner inside native base content or some scrolling item
 */
export default class ImageModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisibleMedia: false,
            //modalImage: require('../../assets/images/Logo-login.png'),
        };
    }

    setModalVisibleMedia = (visible) => {
        this.setState({ modalVisibleMedia: visible });
    }

    render() {
        return (
            <View style={{ width: '100%' }}>
                <View style={{ width: '100%' }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => this.setModalVisibleMedia(true)} onLongPress={() => this.props.onCustomLongPress()}>
                        <ImageComponent style={this.props.style} source={this.props.source} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Modal style={innerStyle.modal} animationType={'fade'} transparent={true} visible={this.state.modalVisibleMedia} onRequestClose={() => { }}>
                        <View style={innerStyle.modal}>
                            <Text style={innerStyle.text} onPress={() => { this.setModalVisibleMedia(false); }}>Close</Text>
                            <Image source={{ uri: this.props.source }} style={{ width: '100%', height: '100%' }} />
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }
}


const innerStyle = StyleSheet.create({
    modal: {
        flex: 1,
        padding: 40,
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    text: {
        color: '#fff',
    },

});

