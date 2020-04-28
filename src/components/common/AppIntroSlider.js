import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import { Container } from 'native-base';
import { LABELS } from '../../languageConstants';
import { Button } from '../common';

const { width } = Dimensions.get('window');
const imageWidth = Dimensions.get('window').width - 10;
const imageHeight = Dimensions.get('window').height / 2.8;
const image = require('../../assets/images/WalkthroughScreen1.png');

export default function AppIntroSlider(props) {

    const fontSizer = () => {
        if (width > 420) {
            return 20;
        } else if (width > 400) {
            return 18;
        } else if (width > 250) {
            return 16;
        } else {
            return 15;
        }
    };

    const headerFontSizer = () => {
        if (width > 420) {
            return 35;
        } else if (width > 400) {
            return 26;
        } else if (width > 250) {
            return 30;
        } else {
            return 28;
        }
    };

    const ImageHeightSizer = () => {
        if (width > 420) {
            return Dimensions.get('window').height / 2.8;
        } else if (width > 400) {
            return Dimensions.get('window').height / 2.8;
        } else if (width > 250) {
            return Dimensions.get('window').height / 2.8;
        } else {
            return Dimensions.get('window').height / 2.8;
        }
    };

    return (
        <Container>
            <View style={{ flex: 1 }}>
                <View style={innerStyle.mainContainer}>
                    <Text style={[innerStyle.headerText, { fontSize: headerFontSizer() }]}>{LABELS.SLIDE_TITLE}</Text>
                </View>
                <View style={innerStyle.imageStyle}>
                    <Image style={{ width: imageWidth, height: ImageHeightSizer() }} source={image} resizeMode='contain' />
                </View>
                <View style={innerStyle.bottomContentStyle}>
                    <View style={{ position: 'absolute', top: 0 }}>
                        <Text style={innerStyle.titleText}>{'How Cérge works'}</Text>
                    </View>
                    <View style={innerStyle.textPoint}>
                        <Text style={{ color: '#000', fontSize: fontSizer() }}>{'1. Enter your info into the Cérge app'}</Text>
                        <Text style={{ color: '#000', fontSize: fontSizer() }}>{'2. Choose which businesses you trust'}</Text>
                        <Text style={{ color: '#000', fontSize: fontSizer() }}>{'3. Cérge announces you to the business as you arrive e.g. pull into carpark'}</Text>
                        <Text style={{ color: '#000', fontSize: fontSizer() }}>{'4. The business carries out their contactless shopping process.'}</Text>
                    </View>
                    <View style={{ width, position: 'absolute', bottom: 5 }}>
                        <Button
                            title={'GET STARTED'}
                            onPress={() => props.onPressGetStartedButton()}
                        />
                    </View>
                </View>
            </View>
        </Container>
    );
}

const innerStyle = StyleSheet.create({
    mainContainer: {
        flex: 0.24,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
    },
    headerText: {
        color: '#778389',
        textAlign: 'center',
        opacity: 1,
        fontFamily: fontBoldItalic,
    },
    titleText: {
        fontSize: 30,
        color: '#000',
        textAlign: 'center',
        fontFamily: fontBoldItalic,
    },
    imageStyle: {
        flex: 0.38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContentStyle: {
        flex: 0.38,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPoint: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
        marginBottom: 15
    }
});
