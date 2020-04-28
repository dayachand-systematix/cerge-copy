import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { HeaderComponent, InputBox, CommonButton, Loader, Text, UserImage } from '../../common';
import { CustomIcon } from '../../../utils/CustomIcon';
import styles from '../../../assets/styles';
import { MESSAGES, BASE_URL } from '../../../config';
import { ValidationComponent, Toast, imagePermissionModal } from '../../../helper';
import {
    updateUserProfileAPI,
    onUploadUserProfileImageAPI,
    getUserProfile
} from '../../../actions/Profile';
import { updateUserData } from '../../../actions/Common';

class UpdateProfile extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: '',
            roles: '',
            userImage: '',
            loading: false,
        };
    }

    /**
     * @method componentDidMount
     * @description called if any props changed  component
     */
    componentDidMount() {
        const state = this.state;
        state.firstName = this.props.userData.firstname;
        state.lastName = this.props.userData.lastname;
        state.email = this.props.userData.email;
        state.contactNumber = this.props.userData.phone;
        if (this.props.userData.profileImage) {
            state.userImage = `${BASE_URL}/users/${this.props.userData._id}/image/${this.props.userData.profileImage}`;
        }
        this.setState(state);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.userData.profileImage != nextProps.userData.profileImage && typeof nextProps.userData.profileImage != 'undefined') {
            const state = this.state;
            state.userImage = `${BASE_URL}/users/${this.props.userData._id}/image/${nextProps.userData.profileImage}`;
            this.setState(state);
        }
    }

    /**
     * @method checkValidation
     * @description called to check validations
     */
    checkValidation = () => {
        const { contactNumber } = this.state;
        /* Call ValidationComponent validate method */
        const validateObj = {
            firstName: {
                required: true,
                name: true,
                minlength: 3,
                maxlength: 25,
            },
            lastName: {
                required: true,
                name: true,
                minlength: 3,
                maxlength: 25,
            },
            email: {
                required: true,
                email: true,
            },
            contactNumber: {
                required: true,
            }
        };
        if (contactNumber !== '') {
            validateObj.contactNumber = { minlength: 8, maxlength: 15, phoneNumber: true };
        }
        this.setState({ error: true });
        return this.validate(validateObj);
    }

    /**
    * @method onInputValueChanged
    * @description called when input field value changes
    */
    onInputValueChanged = (key) => (value) => {
        const state = this.state;
        state[key] = value;
        this.setState(state, () => {
            if (this.state.isSubmitted) {
                this.checkValidation();
            }
        });
    }

    /**
    * @method selectImage
    * @description uset to select image from camera/gallery
    */
    selectUserProfileImage = () => {
        imagePermissionModal(() => {
            const options = {
                title: 'Select Image',
                noData: true,
                takePhotoButtonTitle: 'Capture from Camera',
                chooseFromLibraryButtonTitle: 'Select from Gallery',
                quality: 0.1,
                maxWidth: 500,
                maxHeight: 500,
                storageOptions: {
                    skipBackup: true,
                    cameraRoll: true,
                    waitUntilSaved: true
                }
            };
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled photo picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const size = response.fileSize;
                    if (size <= 5120) {
                        const requestData = {
                            uri: response.uri,
                            type: 'image/png',
                            name: response.fileName,
                            userId: this.props.userData._id
                        };
                        this.onUploadUserProfileImage(requestData);
                    }
                    else {
                        Toast.showToast(MESSAGES.MAX_UPLOAD_IMAGE_SIZE, 'danger');
                    }
                }
            });
        });
    }

    /**
    * @method onUploadUserProfileImage
    * @description Used to upload selected image on the
    * server by calling upload user profile image api
    */
    onUploadUserProfileImage = (requestData) => {
        this.props.onUploadUserProfileImageAPI(requestData, (res) => {
            if (res.status === 204) {
                this.props.getUserProfile(requestData, (response) => {
                    if (response.status === 200) {
                        const finalResponse = response.data;
                        AsyncStorage.getItem('LOGGEDUSER')
                            .then((value) => {
                                if (value !== null) {
                                    value = JSON.parse(value);
                                    let userData = {
                                        ...value,
                                        profileImage: finalResponse.imageId
                                    };
                                    AsyncStorage.setItem('LOGGEDUSER', JSON.stringify(userData))
                                        .then(() => {
                                            this.props.updateUserData();
                                        });
                                }
                            });
                        Toast.showToast(MESSAGES.USER_PROFILE_IMAGE_UPLOAD_SUCCESS, 'success');
                    } else {
                        Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                    }
                });
            } else if (res.status === 400) {
                Toast.showToast(MESSAGES.IMAGE_FILE_SIZE, 'danger');
            } else {
                Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
            }
        });
    }

    /**
    * @method onPressSaveProfileDetails
    * @description Used to call update user profile details api  
    */
    onPressSaveProfileDetails = () => {
        Keyboard.dismiss();
        this.setState({ isSubmitted: true });
        this.checkValidation();
        const { firstName, lastName, email, contactNumber } = this.state;

        const requestData = {
            firstname: firstName,
            lastname: lastName,
            email: email,
            phone: contactNumber
        };
        if (this.isFormValid()) {
            this.props.updateUserProfileAPI(requestData, this.props.userData._id, (res) => {
                if (res.status === 200) {
                    Toast.showToast(MESSAGES.PROFILE_UPDATE_SUCESS, 'success');
                    /** Update the local storage and redux storage */
                    this.props.navigation.navigate('Home');
                } else {
                    Toast.showToast(MESSAGES.SOME_ERROR, 'danger');
                }
            });
        } else {
            Toast.showToast(MESSAGES.FIELD_ERROR_MESSAGE, 'danger');
        }
    }

    /**
       * @method render
       * @description  render Component 
       */
    render() {
        return (
            <Container style={styles.container}>
                <Loader isLoading={this.props.loading} />
                <HeaderComponent
                    title='Edit Profile'
                    leftButton='menu'
                />
                <Content style={styles.bgWhite}>
                    <View style={[styles.row, styles.bgWhite, paddingTop.Ten]}>
                        <View style={[styles.verticalCenter, paddingBottom.Fifteen, paddingTop.Twenty]}>
                            <View style={styles.pRelative}>
                                <View style={innerStyle.profileBox}>
                                    <View>
                                        {
                                            this.state.userImage === "" ? <CustomIcon name="user" style={innerStyle.boxIcon} /> :
                                                <UserImage style={styles.profileBoxImg} source={this.state.userImage} />
                                        }
                                    </View>
                                </View>
                                <TouchableOpacity style={innerStyle.cameraimagewrap} onPress={this.selectUserProfileImage}>
                                    <View style={innerStyle.cameraWrap}>
                                        <CustomIcon style={innerStyle.cameraimage} name="profile_edit" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View><Text style={styles.smallHeading}>Change Image</Text></View>
                            <View><Text style={[styles.smallHeading, { paddingTop: 0 }]}> Max Size: 5MB</Text></View>
                        </View>
                    </View>
                    <View style={styles.formBox}>
                        <View style={styles.gridRows}>
                            <View style={styles.gridCols}>
                                <InputBox
                                    label="First Name"
                                    mandatory={true}
                                    isDisabled={false}
                                    placeholder=''
                                    placeholderTextColor="#2C3138"
                                    onChangeText={this.onInputValueChanged('firstName')}
                                    maxLength={26}
                                    value={this.state.firstName}
                                    isFieldInError={this.isFieldInError('firstName')}
                                    fieldErrorMessage={this.getErrorsInField('firstName')}
                                />
                            </View>
                            <View style={styles.gridCols}>
                                <InputBox
                                    label="Last Name"
                                    mandatory={true}
                                    isDisabled={false}
                                    placeholder=''
                                    placeholderTextColor="#2C3138"
                                    onChangeText={this.onInputValueChanged('lastName')}
                                    maxLength={26}
                                    value={this.state.lastName}
                                    isFieldInError={this.isFieldInError('lastName')}
                                    fieldErrorMessage={this.getErrorsInField('lastName')}
                                />
                            </View>
                        </View>
                        <View style={styles.gridRows}>
                            <View style={styles.flexOne}>
                                <InputBox
                                    label='Email Address'
                                    mandatory={true}
                                    isDisabled={false}
                                    placeholder=''
                                    maxLength={70}
                                    onChangeText={this.onInputValueChanged('email')}
                                    keyboardType={'email-address'}
                                    iconName='mail'
                                    IconSize={16}
                                    value={this.state.email}
                                    isFieldInError={this.isFieldInError('email')}
                                    fieldErrorMessage={this.getErrorsInField('email')}
                                />
                            </View>
                        </View>
                        <View style={styles.gridRows}>
                            <View style={styles.flexOne}>
                                <InputBox
                                    placeholder=''
                                    label={'Phone Number'}
                                    numberOfLines={1}
                                    keyboardType="numeric"
                                    iconName='call'
                                    IconSize={16}
                                    maxLength={15}
                                    onChangeText={this.onInputValueChanged('contactNumber')}
                                    value={this.state.contactNumber}
                                    multiline={true}
                                    isFieldInError={this.isFieldInError('contactNumber')}
                                    fieldErrorMessage={this.getErrorsInField('contactNumber')}
                                />
                            </View>
                        </View>
                        <View style={[styles.gridRows, marginTop.Twenty, paddingLeft.Ten, paddingRight.Ten, styles.verticalCenter]}>
                            <CommonButton label="SAVE" dynamicBtnStyle={innerStyle.btnWidth} onPress={this.onPressSaveProfileDetails} />
                        </View>
                        <View style={[styles.gridRows, marginTop.Twenty]}>
                            <View style={[styles.verticalCenter, paddingLeft.Ten, paddingRight.Ten]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}>
                                    <Text style={innerStyle.passwordText}>CHANGE PASSWORD</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const innerStyle = StyleSheet.create({
    passwordText: {
        fontSize: 18,
        color: '#040605',
        borderBottomColor: '#040605',
        borderBottomWidth: 1,
        borderStyle: 'solid'
    },
    btnWidth: {
        width: '100%',
        minWidth: '100%'
    },
    cameraWrap: {
        width: 28,
        height: 28,
        backgroundColor: '#6E68B0',
        padding: 3,
        borderRadius: 50,
        textAlign: 'center',
        alignItems: 'center',
    },
    cameraimage: {
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 5,
        color: '#fff',
        fontSize: 16
    },
    cameraimagewrap: {
        position: 'absolute', bottom: 10, right: -5,
    },
    boxIcon: {
        fontSize: 30,
    },
    profileBox: {
        width: 80, height: 80, borderRadius: 50, borderWidth: 1, borderColor: '#C9D2DB', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
});

const mapStateToProps = ({ auth, profile }) => {
    const { loading } = profile;
    const userData = auth.userData.loggedUser;
    return {
        userData,
        profile,
        loading,
    };
};

export default connect(mapStateToProps, { updateUserProfileAPI, onUploadUserProfileImageAPI, getUserProfile, updateUserData })(UpdateProfile);
