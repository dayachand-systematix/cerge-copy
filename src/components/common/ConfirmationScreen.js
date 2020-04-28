import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Button, Icon, Right, Body, Left } from 'native-base';
import styles from '../../../assets/styles';
import { Confirm, Text } from '../../common';
class ConfirmationScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state = { showConfirm: false };
    }

    /**
     * @method showConfirm
     * @description function to show alert
     */
    showConfirm = () => {
        this.setState({
            showConfirm: true
        });
    };


    /**
     * @method hideConfirm
     * @description function to show hide
     */
    hideConfirm = () => {
        this.setState({
            showConfirm: false
        });
    };

    render() {
        const { showConfirm } = this.state;
        return (
            <Container>
                <Header>
                    <Left style={styles.flexOne}>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.navigate('DrawerOpen')}
                        >
                            <Icon name="ios-menu" />
                        </Button>
                    </Left>
                    <Body style={styles.homeBody}>
                        <Title>Confirmation</Title>
                    </Body>
                    <Right style={styles.flexOne} />
                </Header>
                <Content>
                    <View style={styles.confirmContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                this.showConfirm();
                            }}
                        >
                            <View style={styles.button}>
                                <Text style={styles.text}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                        <Confirm
                            show={showConfirm}
                            title="Confirm"
                            message="Do you want to delete this record?"
                            cancelText="No, cancel"
                            confirmText="Yes, delete it"
                            onCancelPressed={() => {
                                this.hideConfirm();
                            }}
                            onConfirmPressed={() => {
                                this.hideConfirm();
                            }}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default ConfirmationScreen;
