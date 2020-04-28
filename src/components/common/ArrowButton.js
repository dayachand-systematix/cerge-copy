import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import NavigationService from '../../services/navigator';

class ArrowButton extends PureComponent {
  routeArrow = () => {
    const { retailerDetails, onPress } = this.props;

    if (retailerDetails !== undefined && retailerDetails) {
      NavigationService.navigate(onPress, {
        retailerDetails
      });
    } else {
      this.props.navigation.navigate(onPress);
    }
  };

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.routeArrow()}
      >
        <Image
          source={require('../../assets/images/Group.png')}
          style={innerStyle.Image}
        />
      </TouchableOpacity>
    );
  }
}

const innerStyle = StyleSheet.create({
  Image: {
    width: 50,
    height: 50
  }
});

export default withNavigation(ArrowButton);
