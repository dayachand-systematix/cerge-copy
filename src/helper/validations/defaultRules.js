'use strict';
import Moment from 'moment';

/* Custom default rules to validate form fields */
const defaultRules = {
  name: /^[a-zA-Z\s]+$/,
  numbers: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  password: /^.{5,25}$/,
  zipcode: /^[a-zA-Z0-9]{4,5}$/,
  mobileNumber: /^[0]?[789]\d{9}$/,
  phoneNumber: /^[\+]{0,1}(\d{8,15}|[\(][\+]{0,1}\d{2,}[\13)]*\d{5,13}|\d{2,6}[\-]{1}\d{2,13}[\-]*\d{3,13})/,
  website: /^(http|https)\:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  specialName: /^[A-Za-z\'\s\.\,\@\_\-]+$/,
  checkFacebooklink: /^(http|https)\:\/\/www.facebook.com\/.*/,
  checkTwitterlink: /^(http|https)\:\/\/www.twitter.com\/.*/,
  checkinstagramlink: /^(http|https)\:\/\/www.instagram.com\/.*/,
  checkYoutubelink: /^(http|https)\:\/\/www.youtube.com\/.*/,
  checkSnapchatlink: /^(http|https)\:\/\/www.snapchat.com\/.*/,
  checkIMDBlink: /^(http|https)\:\/\/www.imdb.com\/.*/,
  matchPassword(password, value) {
    if (value === password) {
      return true;
    }
    return false;
  },

  checkCurrentTimeValidation(time) {
    const currentDate = Moment().format('DD/MM/YYYY');
    const selectTimeObject = Moment(`${currentDate} ${time}`, 'DD/MM/YYYY hh:mm A');
    const currentTimeObject = Moment();
    if (!selectTimeObject.isAfter(currentTimeObject)) {
      return false;
    }
    return true;
  },

  checkEndTimeValidation(time) {
    const currentDate = Moment().format('DD/MM/YYYY');
    const selectTimeObject = Moment(`${currentDate} ${time}`, 'DD/MM/YYYY hh:mm A');
    const startTimeObject = Moment(`${currentDate} ${'06:00'}`, 'DD/MM/YYYY HH:mm');
    const endTimeObject = Moment(`${currentDate} ${'22:00'}`, 'DD/MM/YYYY HH:mm');
    if (selectTimeObject.isSameOrAfter(startTimeObject)) {
      if (selectTimeObject.isSameOrBefore(endTimeObject)) {
        return true;
      }
      return false;
    }
    return false;
  },

  minlength(length, value) {
    if (length === void (0)) {
      throw 'ERROR: It is not a valid length, checkout your minlength settings.';
    } else if (value) {
      if (value.length > length - 1) {
        return true;
      }
    }
    return false;
  },
  maxlength(length, value) {
    if (length === void (0)) {
      throw 'ERROR: It is not a valid length, checkout your maxlength settings.';
    } else if (value) {
      if (value.length > length) {
        return false;
      }
    }
    return true;
  },
  required: /\S+/,
};

export default defaultRules;
