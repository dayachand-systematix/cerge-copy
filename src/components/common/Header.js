import React, { PureComponent } from 'react';
import { Header, Button } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import styles from '../../assets/styles';
import { CustomIcon } from '../../utils/CustomIcon';

class HeaderComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('LOGGEDUSER')
            .then((value) => {
                if (value != null) {
                    this.setState({
                        isLoggedIn: true
                    });
                }
            });
    }

    render() {
        const props = this.props;
        return (
            <Header iosBarStyle="dark-content" style={props.isTransparent ? innerStyle.headerLogin : innerStyle.header}  {...props.headerProps} noShadow={true}>
                <View style={[styles.row, styles.w100]}>
                    <View style={[styles.column, innerStyle.headerMenu, styles.verticalCenterLeft]}>
                        {props.leftButton == 'menu' && (
                            <Button transparent style={[styles.buttonFull, innerStyle.mrlMinus]} onPress={() => this.props.navigation.openDrawer()}>
                                <CustomIcon style={props.isTransparent ? innerStyle.headerIcon : innerStyle.headerIconBlack} name="menu" />
                            </Button>
                        )}
                        {props.leftButton == 'back' && (
                            <Button transparent style={[styles.buttonFull, innerStyle.mrlMinus]} onPress={() => this.props.navigation.goBack()} >
                                <CustomIcon style={props.isTransparent ? innerStyle.headerIcon : innerStyle.headerIconBlack} name="back-arrow" />
                            </Button>
                        )}
                        {props.leftButton == 'custom' && (
                            props.renderLeftComponent()
                        )}
                        {props.leftButton == 'customBack' && (
                            <Button transparent style={[styles.buttonFull, innerStyle.mrlMinus]}
                                onPress={() => this.props.navigation.navigate(props.routeName)}>
                                <CustomIcon style={props.isTransparent ? innerStyle.headerIcon : innerStyle.headerIconBlack} name="back-arrow" />
                            </Button>
                        )}
                        {props.leftButton == 'manualBack' && (
                            <Button transparent style={[styles.buttonFull, innerStyle.mrlMinus]}
                                onPress={() => this.props.onPressBack()} >
                                <CustomIcon style={props.isTransparent ? innerStyle.headerIcon : innerStyle.headerIconBlack} name="back-arrow" />
                            </Button>
                        )}

                    </View>
                    {/* {
                        this.state.isLoggedIn === true &&
                        <View style={[styles.column, styles.verticalCenter, innerStyle.headerUser]}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                                <Image source={require('../../assets/images/userimg.png')} style={innerStyle.userImg} />
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={[styles.column, styles.verticalCenter, innerStyle.headerTitle]}>
                        <Title style={props.isTransparent ? innerStyle.headerTitle : innerStyle.headerTitleBlack} >{props.title}</Title>
                    </View>
                    <View style={[styles.column, styles.verticalCenterRight, innerStyle.infoIcon]}>
                        {props.info &&
                            <TouchableOpacity onPress={this.props.rightAction} >
                                <CustomIcon style={innerStyle.iconStyles} name="info" />
                            </TouchableOpacity>
                        }
                    </View>
                    {props.rightButton &&
                        <TouchableOpacity onPress={() => this.props.rightAction()} style={[styles.column, styles.verticalCenterRight, innerStyle.infoIcon]}>
                            <CustomIcon style={innerStyle.iconStyles} name={props.rightButton} />
                        </TouchableOpacity>
                    } */}
                </View>
                <View style={innerStyle.headerLeft}>
                    {props.renderRightComponent && (
                        props.renderRightComponent()
                    )}
                </View>
            </Header>
        );
    }
}

const innerStyle = StyleSheet.create({
    headerLogin: {
        backgroundColor: 'transparent',
        borderBottomColor: 'transparent',
        marginTop: Platform.OS === 'ios' ? 0 : 20
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 3,
        borderBottomColor: '#E8E9ED',
        paddingTop: 35,
        paddingBottom: 0,
        height: 75
    },
    headerBody: {
        alignItems: 'flex-start',
        width: deviceWidth - 100,
        justifyContent: 'center'
    },
    headerTitle: {
        fontFamily: fontRegular,
        color: '#040605',
        fontSize: 20
    },
    headerTitleBlack: {
        fontFamily: fontRegular,
        color: '#040605',
        fontSize: 18
    },
    headerLeft: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerIcon: {
        color: '#040605',
        fontSize: 22,
        textAlign: 'left'
    },
    headerIconBlack: {
        color: '#040605',
        fontSize: 26
    },
    userImg: {
        width: 22,
        height: 22
    },
    headerMenu: {
        maxWidth: 50,
        width: 50,
        marginLeft: -7
    },
    headerUser: {
        maxWidth: 25,
        width: 25
    },
    infoIcon: {
        maxWidth: 53,
        width: 53
    },
    iconStyles: {
        fontSize: 30,
        color: '#040605'
    },
    mrlMinus: {
        marginLeft: -5
    }
});

export default withNavigation(HeaderComponent);
