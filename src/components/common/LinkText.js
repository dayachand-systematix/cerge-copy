import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';
import { Text } from '../common';
import {sendEmail} from "../../services/sendEmail";

class LinkText extends PureComponent {
  /**
   * @method onPressTextData
   * @description navigation on props screen
   */
  onPressTextData = () => {
    const { onPressLink, linkNavigation } = this.props;
    if(linkNavigation == 'EMAIL') {
      sendEmail()
    } else if (onPressLink && typeof onPressLink == 'function') {
      this.props.onPressLink()
    } else {
      this.props.navigation.navigate(linkNavigation);
    }
  };

  render() {
    const props = this.props;
    let innerLinkTextStyle = innerStyles.innerLinkText;
    if (props.textColorCode != undefined) {
      innerLinkTextStyle = [
        innerStyles.innerLinkText,
        { color: props.textColorCode }
      ];
    }
    if(props.style != undefined && props.style === true){
      innerLinkTextStyle = [
        innerStyles.innerLinkText,
        { marginLeft: -10, color: props.textColorCode }
      ];
    }

    return (
      <TouchableOpacity onPress={() => this.onPressTextData()}>
        <Text style={innerLinkTextStyle}>{props.linkTextData}</Text>
      </TouchableOpacity>
    );
  }
}

const innerStyles = StyleSheet.create({
  innerLinkText: {
    color: '#000000',
    textDecorationLine: 'underline'
  }
});

export default withNavigation(LinkText);
