'use strict';

/* Custom default messages to validate form fields */
const defaultMessages = {
  /* English language - Used by default */
  en: {
    name: 'Please enter a valid name.',
    numbers: 'Please enter a valid number.',
    password: 'Password requires minimum 5 & maximum 25 characters.',
    email: 'Please enter a valid email address.',
    date: 'Please enter a valid date ({1}).',
    minlength: 'Min length must be {1}.',
    maxlength: 'Max length must be {1}.',
    required: 'This field is required.',
    checkRequired: 'This field is required.',
    matchPassword: 'Confirm password does not match with new password',
    zipcode: 'Please enter a valid zipcode',
    mobileNumber: 'Please enter a valid mobile number',
    website: 'Please enter a valid website(https://www.example.com).',
    checkMinAndMaxLength: 'Please enter min 5 words',
    phoneNumber: 'Please enter a valid phone number',
    specialName: 'Please enter a valid name',
    checkFacebooklink: 'Please enter a valid facebook profile url',
    checkTwitterlink: 'Please enter a valid twitter profile url',
    checkinstagramlink: 'Please enter a valid instagram profile url',
    checkYoutubelink: 'Please enter a valid youtube profile url',
    checkSnapchatlink: 'Please enter a valid snapchat profile url',
    checkIMDBlink: 'Please enter a valid imdb profile url',
    checkEndTimeValidation: 'Please enter the time between 6AM to 10PM.',
    checkCurrentTimeValidation: 'Time should be greater then current time.',
  },
};

export default defaultMessages;
