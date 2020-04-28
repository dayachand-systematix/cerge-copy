import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Keyboard,
    StatusBar,
    Platform,
    Text,
    Dimensions
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Container, Content, Textarea } from 'native-base';
import styles from '../../../assets/styles';
import { ValidationComponent, Toast } from '../../../helper';
import {
    InputBox,
    DatePickerInput,
    HeaderContent,
    LabelComponent,
    Loader
} from '../../common';
import { LABELS } from '../../../languageConstants';
import { UpdateShoppingStatusAction } from '../../../actions/Shopping';
import { getUserProfileAction } from '../../../actions/Profile';
import { MESSAGES, STATUS_CODES, DATE_FORMAT, TIME_FORMAT } from '../../../config';
import {ASSISTANCE, BROWSING, DND, SHOPPING} from "../../../constants";

const { width } = Dimensions.get('window');

class Shopping extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitted: false,
            shoppingStatus: SHOPPING,
            shoppingRequirement: '',
            shoppingDate: moment().format(DATE_FORMAT),
            fromTime: '',
            toTime: '',
            isValidTime: true,
            focusedScreen: false
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.navListener = navigation.addListener('willFocus', () =>
            this.setState({ focusedScreen: true }),
        );
        navigation.addListener('willBlur', () =>
            this.setState({
                focusedScreen: false
            }),
        );
    }

    getShoppingData = () => {
        const { userProfile: { shoppingStatus } } = this.props;
        if (shoppingStatus) {
            if (shoppingStatus.shoppingDate != null && shoppingStatus.fromTime !== null && shoppingStatus.toTime !== null) {
                this.interval = setInterval(() => {
                    this.updateStatus();
                }, 9000);
            }
            this.setShoppingStatusData(shoppingStatus);
        }
    }

    componentWillUnmount() {
        this.navListener.remove();
        clearInterval(this.interval);
    }

    componentWillReceiveProps(nextProps) {
        const { userProfile: { shoppingStatus } } = nextProps;
        if (this.props.userProfile.shoppingStatus != shoppingStatus) {
            this.setShoppingStatusData(shoppingStatus);
        }
    }

    /**
   * @method setShoppingStatusData
   * @description to check and update the shoppingStatus data and set in state
   */
    setShoppingStatusData = (shoppingStatus) => {
        if (shoppingStatus) {
            this.setState({
                shoppingStatus: shoppingStatus.shoppingStatus,
                shoppingRequirement: shoppingStatus.shoppingRequirement,
                shoppingDate: shoppingStatus.shoppingDate !== '' && shoppingStatus.shoppingDate !== null && shoppingStatus.shoppingDate !== undefined ? moment.utc(shoppingStatus.shoppingDate).local().format(DATE_FORMAT) : moment().format(DATE_FORMAT),
                fromTime: shoppingStatus.fromTime !== '' && shoppingStatus.fromTime !== null && shoppingStatus.fromTime !== undefined ? moment.utc(shoppingStatus.fromTime).local().format(TIME_FORMAT) : '',
                toTime: shoppingStatus.toTime !== '' && shoppingStatus.toTime !== null && shoppingStatus.toTime !== undefined ? moment.utc(shoppingStatus.toTime).local().format(TIME_FORMAT) : '',
            }, () => {
                this.setTimeInterval();
            });
        }
    }

    /**
   * @method updateStatus
   * @description to check and update the shoppers staus from the local storage
   */
    updateStatus = () => {
        const { userProfile: { shoppingStatus } } = this.props;
        const temp = moment();
        if (shoppingStatus != null && shoppingStatus.shoppingDate != null &&
            shoppingStatus.shoppingDate != undefined &&
            shoppingStatus.shoppingDate != '' && shoppingStatus.toTime != null &&
            shoppingStatus.toTime != undefined && shoppingStatus.toTime != '') {
            if (moment(temp).isSame(shoppingStatus.shoppingDate, 'day') === true &&
                moment(shoppingStatus.toTime).diff(moment(temp), 'seconds') < -1) {
                //call update status API if to time Date is greater then current Date
                this.callUpdateStatusAPI();
            }
        }
    }

    /**
    * @method callUpdateStatusAPI
    * @description called to update the status
    */
    callUpdateStatusAPI = () => {
        const requestData = {
            userShoppingStatus: {
                shoppingStatus: SHOPPING,
                shoppingRequirement: '',
                shoppingDate: '',
                fromTime: '',
                toTime: '',
            }
        };
        this.props.UpdateShoppingStatusAction(requestData, res => {
            if (res && res.data && res.data.code && res.data.code == STATUS_CODES.OK) {
                this.props.getUserProfileAction(response => {
                    if (response && response.data && response.data.data && response.data.data.userProfile) {
                        const { userProfile } = response.data.data;
                        clearInterval(this.interval);
                        AsyncStorage.setItem('userProfile', JSON.stringify(userProfile)).then(
                            () => {
                                console.log('Success');
                            });
                    }
                });
            }
        });
    }

    /**
     * @method onInputValueChanged
     * @description called when input field value changes
     */
    onInputValueChanged = key => value => {
        const state = this.state;
        state[key] = value;
        this.setState(state, () => {
            if (this.state.isSubmitted) {
                this.checkValidation();
            }
            if (
                (key == 'fromTime' || key == 'toTime')
            ) {
                this.setTimeInterval();
            }
        });
    };

    /**
     * @method setTimeInterval
     * @description To set the Time Interval
     */
    setTimeInterval = () => {
        if (this.state.fromTime != '' && this.state.toTime != '') {
            const beginningTime1 = moment(this.state.fromTime, 'h:mma');
            const endTime1 = moment(this.state.toTime, 'h:mma');
            const beginningTime = beginningTime1.format('YYYY-MM-DDTHH:mm:ssZ');
            const endTime = endTime1.format('YYYY-MM-DDTHH:mm:ssZ');

            /* Here we are calculating the difference of time*/
            if ((moment(beginningTime) < moment(endTime))) {
                this.setState({ isValidTime: true });
            } else {
                this.setState({ isValidTime: false });
                Toast.showToast(MESSAGES.SHOPPING_TIMERANGE_ERROR, 'warning');
            }
        } else if ((this.state.fromTime == '' && this.state.toTime == '')) {
            this.setState({ isValidTime: true });
        } else {
            this.setState({ isValidTime: false });
        }
    }

    /**
     * @method checkValidation
     * @description called to check validations
     */
    checkValidation = () => {
        /* Call ValidationComponent validate method */
        const { shoppingRequirement } = this.state;
        const validateObj = {
            shoppingStatus: {
                required: true
            },
        };
        if (shoppingRequirement !== '') {
            validateObj.shoppingRequirement = { maxlength: 140 };
        }
        this.setState({ error: true });
        return this.validate(validateObj);
    };

    /**
     * @method onPressSubmitButton
     * @description Call shopping post API
     */
    onPressSubmitButton = () => {
        Keyboard.dismiss();
        this.setTimeInterval();
        const {
            shoppingStatus,
            shoppingRequirement,
            shoppingDate,
            fromTime,
            toTime,
            isValidTime
        } = this.state;
        this.setState({ isSubmitted: true });
        this.checkValidation();
        const from = fromTime !== '' ? moment(fromTime, TIME_FORMAT).format() : '';
        const to = toTime !== '' ? moment(toTime, TIME_FORMAT).format() : '';

        const requestData = {
            userShoppingStatus: {
                shoppingStatus,
                shoppingRequirement,
                shoppingDate: moment(shoppingDate, DATE_FORMAT).format(),
                fromTime: from,
                toTime: to,
            }
        };
        if (this.isFormValid() && isValidTime) {
            this.props.UpdateShoppingStatusAction(requestData, res => {
                if (res && res.data && res.data.code && res.data.code == STATUS_CODES.OK) {
                    Toast.showToast(MESSAGES.SHOPPING_STATUS_SUCCESS, 'success');
                    this.props.getUserProfileAction(res => {
                        if (res == false) {
                            this.props.navigation.navigate('Auth');
                        } else if (res && res.data && res.data.data && res.data.data.userProfile) {
                            const { userProfile } = res.data.data;
                            AsyncStorage.setItem('userProfile', JSON.stringify(userProfile)).then(
                                () => {
                                    this.setState({ isValidTime: false });
                                    this.props.navigation.navigate('Invitations');
                                });
                        } else {
                            this.props.navigation.navigate('Invitations');
                        }
                    });
                }
            });
        } else if (this.isFormValid() && !isValidTime) {
            Toast.showToast(MESSAGES.SHOPPING_TIMERANGE_ERROR, 'warning');
        }
    };

    /**
     * @method onPressCancelImage
     *@description call for navigate route
     */
    onPressCancelImage = () => {
        this.props.navigation.navigate('Invitations');
    };

    /**
     * @method onPressCancelImage
     *@description call for navigate route
     */
    setShoppingStatus = (shoppingStatus) => {
        this.setState({ shoppingStatus });
    }

    /**
     * @method render
     * @description to render component
     */
    render() {
        const {
            shoppingStatus,
            shoppingRequirement,
            shoppingDate,
            fromTime,
            toTime,
            focusedScreen
        } = this.state;
        return (
            <Container style={innerStyle.container}>
                {focusedScreen && (
                    <StatusBar backgroundColor="rgb(0, 0, 0)" barStyle={'light-content'} hidden={false} />
                )
                }
                <NavigationEvents
                    onDidFocus={() => this.getShoppingData()}
                    onDidBlur={() => clearInterval(this.interval)}
                />
                <Loader isLoading={this.props.shoppingLoading || this.props.loading} />
                <HeaderContent
                    title={LABELS.USERNAME}
                    subTitle={LABELS.SHOPPING_RATING_SUB_TITLE}
                    blackTheme={false}
                    showProfileSection={false}
                    showBugReport
                />
                <Content>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row-reverse', marginTop: 5 }}
                        onPress={this.onPressCancelImage}
                    >
                        <Image
                            source={require('../../../assets/images/Cancle.png')}
                            style={{
                                width: 40,
                                height: 40,
                                left: 20,
                                marginBottom: 10
                            }}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
                        <View style={[innerStyle.iconView]}>
                            <TouchableOpacity onPress={() => this.setShoppingStatus(SHOPPING)}>
                                <View style={innerStyle.imageViewWrap}>
                                    <Image
                                        source={require('../../../assets/images/ShoppingIcon.png')}
                                        style={{
                                            width: 40,
                                            height: 40,
                                        }}
                                        resizeMode={'contain'}
                                    />
                                </View>
                                <View style={{ borderBottomWidth: shoppingStatus === SHOPPING ? 2 : 0, borderBottomColor: shoppingStatus === SHOPPING ? '#FFFFFF' : 'transparent' }}>
                                    <Text style={[innerStyle.imageText]}>
                                        {LABELS.SHOPPING.toUpperCase()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={innerStyle.iconView}>
                            <TouchableOpacity onPress={() => this.setShoppingStatus(BROWSING)}>
                                <View style={innerStyle.imageViewWrap}>
                                    <Image
                                        source={require('../../../assets/images/Browsing.png')}
                                        style={{
                                            width: 40,
                                            height: 40,
                                        }}
                                        resizeMode={'contain'}
                                    />
                                </View>
                                <View style={{ borderBottomWidth: shoppingStatus === BROWSING ? 2 : 0, borderBottomColor: shoppingStatus === BROWSING ? '#FFFFFF' : 'transparent' }}>
                                    <Text style={innerStyle.imageText}>
                                        {LABELS.BROWSING.toUpperCase()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[innerStyle.iconView]}>
                            <TouchableOpacity onPress={() => this.setShoppingStatus(DND)}>
                                <View style={innerStyle.imageViewWrap}>
                                    <Image
                                        source={require('../../../assets/images/DND.png')}
                                        style={{
                                            width: 40,
                                            height: 40,
                                        }}
                                        resizeMode={'contain'}
                                    />
                                </View>
                                <View style={{ borderBottomWidth: shoppingStatus === DND ? 2 : 0, borderBottomColor: shoppingStatus === DND ? '#FFFFFF' : 'transparent' }}>
                                    <Text style={innerStyle.imageText}>
                                        {LABELS.DND.toUpperCase()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[innerStyle.iconView]}>
                            <TouchableOpacity onPress={() => this.setShoppingStatus(ASSISTANCE)}>
                                <View style={innerStyle.imageViewWrap}>
                                    <Image
                                        source={require('../../../assets/images/Assistance.png')}
                                        style={{
                                            width: 40,
                                            height: 40,
                                        }}
                                        resizeMode={'contain'}
                                    />
                                </View>
                                <View style={{ borderBottomWidth: shoppingStatus === ASSISTANCE ? 2 : 0, borderBottomColor: shoppingStatus === ASSISTANCE ? '#FFFFFF' : 'transparent' }}>
                                    <Text style={innerStyle.imageText}>
                                        {LABELS.ASSISTANCE.toUpperCase()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flexOne, innerStyle.mainPWwrap]}>
                        {/*<InputBox*/}
                            {/*label={LABELS.SHOPPING_FOR}*/}
                            {/*//mandatory*/}
                            {/*isDisabled={false}*/}
                            {/*placeholder={LABELS.SHOPPING_FOR_PLACEHOLDER}*/}
                            {/*onChangeText={this.onInputValueChanged('shoppingRequirement')}*/}
                            {/*maxLength={140}*/}
                            {/*value={shoppingRequirement}*/}
                            {/*placeholderTextColor='#2C3138'*/}
                            {/*isFieldInError={this.isFieldInError('shoppingRequirement')}*/}
                            {/*fieldErrorMessage={this.getErrorsInField('shoppingRequirement')}*/}
                            {/*blackTheme*/}
                        {/*/>*/}

                        <View>
                            <LabelComponent
                                label={LABELS.SHOPPING_FOR}
                                blackTheme={true}
                            />

                            <Textarea rowSpan={5} bordered
                                      placeholder={LABELS.SHOPPING_FOR_PLACEHOLDER}
                                      onChangeText={this.onInputValueChanged('shoppingRequirement')}
                                      maxLength={140}
                                      style={{backgroundColor: '#FFF', color: '#000', marginTop: 15}}
                                      value={shoppingRequirement}
                            />

                        </View>

                        <View style={{ marginTop: 15 }}>
                            <LabelComponent label={LABELS.FROMTIME} blackTheme />
                            <View style={{ width: '65%' }}>
                                <View style={innerStyle.datePicker}>
                                    <View style={{ flex: 0.40 }}>
                                        <DatePickerInput
                                            date={fromTime}
                                            mandatory={false}
                                            mode='time'
                                            placeholder='00:00 am'
                                            format={TIME_FORMAT}
                                            onDateChange={this.onInputValueChanged('fromTime')}
                                            blackTheme
                                            isFieldInError={this.isFieldInError('fromTime')}
                                            fieldErrorMessage={this.getErrorsInField('fromTime')}
                                        />
                                    </View>
                                    <View style={{ flex: 0.20, justifyContent: 'center' }}>
                                        <Image
                                            source={require('../../../assets/images/whiteLine.png')}
                                            style={innerStyle.innerTextLine}
                                        />
                                    </View>
                                    <View style={{ flex: 0.40 }}>
                                        <DatePickerInput
                                            date={toTime}
                                            mode='time'
                                            placeholder='00:00 am'
                                            format={TIME_FORMAT}
                                            onDateChange={this.onInputValueChanged('toTime')}
                                            blackTheme
                                            isFieldInError={this.isFieldInError('toTime')}
                                            fieldErrorMessage={this.getErrorsInField('toTime')}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: '30%', marginBottom: 50 }}>
                                <DatePickerInput
                                    date={shoppingDate}
                                    mode='date'
                                    placeholder='00/00/00'
                                    label={LABELS.ON}
                                    iconName={'ios-calendar'}
                                    showIcon
                                    format={DATE_FORMAT}
                                    minDate={new Date()}
                                    onDateChange={this.onInputValueChanged('shoppingDate')}
                                    blackTheme
                                    isFieldInError={this.isFieldInError('shoppingDate')}
                                    fieldErrorMessage={this.getErrorsInField('shoppingDate')}
                                />
                            </View>
                            <View style={{ marginLeft: 10, marginTop: 20 }}>
                                <TouchableOpacity
                                    onPress={() => this.onPressSubmitButton()}
                                >
                                    <Image
                                        source={require('../../../assets/images/Group.png')}
                                        style={innerStyle.Image}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = ({ shopping, profile }) => {
    const { shoppingLoading } = shopping;
    const { userProfile, loading } = profile;
    console.log('userProfile userProfile', userProfile);
    return { shoppingLoading, userProfile, loading };
};

export default connect(mapStateToProps, {
    UpdateShoppingStatusAction,
    getUserProfileAction
})(Shopping);

const innerStyle = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        opacity: 1
    },
    text: {
        textAlign: 'left',
        letterSpacing: 1.35,
        color: '#FFFFFF',
        left: 10
    },
    imageViewWrap: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainPWwrap: {
        paddingTop: 30,
        paddingLeft: 15,
        paddingRight: 15
    },
    btnWidth: {
        width: '100%',
        minWidth: '100%'
    },
    innerTextLine: {
        width: '43%',
        height: '2%',
        left: 12,
        top: Platform.OS === 'ios' ? 0 : 5,
        marginBottom: Platform.OS === 'ios' ? 10 : 0,
    },
    textLine: {
        paddingLeft: 10,
        top: 50
    },
    Image: {
        width: 50,
        height: 50
    },
    iconView: {
        flex: 0.25, alignItems: 'center', justifyContent: 'center', paddingTop: 5, paddingBottom: 5, borderRadius: 5
    },
    imageText: {
        color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', marginTop: 5, fontSize: width > 400 ? 12 : 10, fontFamily: fontRegular
    },
    datePicker: {
        flex: 1, justifyContent: 'center', flexDirection: 'row'
    }
});
