import React, {Component} from 'react';
import { WebView } from 'react-native-webview';
import {
    StatusBar
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import {TERMS_LINK, TERMS_TITLE} from "../../../config/index";


class TermCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
        };
    }

    injectjs = () => {
        let jsCode = `
        document.querySelector('.close-page').addEventListener('click', event => {
            window.ReactNativeWebView.postMessage('close');
            event.preventDefault();
        });
    `;
        return jsCode;
    };

    onMessage = event => {
        let reponseData = event.nativeEvent.data;
        console.log(reponseData)
        if(reponseData == 'close') {
            this.navigateBack()
        }
    }

    navigateBack = () => {
        this.props.navigation.goBack()
    }

    render() {
        return (

            <Container>
                <Header style={{ paddingTop: getStatusBarHeight() }}>
                    <Left>
                        <Button transparent onPress={()=> this.navigateBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                    <Title>{TERMS_TITLE}</Title>
                    </Body>
                </Header>

                <WebView
                    ref={webview => {
                        this.webview = webview;
                    }}
                    source={{
                        uri: TERMS_LINK
                    }}
                    startInLoadingState
                    useWebKit
                    injectedJavaScript={this.injectjs()}
                    javaScriptEnabled
                    onMessage={e => this.onMessage(e)}
                    //style={{ marginTop: getStatusBarHeight() }}
                />

            </Container>
        );
    }
}


export default TermCondition
