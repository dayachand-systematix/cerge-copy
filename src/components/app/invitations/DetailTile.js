import React, { PureComponent } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { withNavigation } from "react-navigation";
import { Text } from "../../common";
import { LABELS } from "../../../languageConstants";
import { API } from "../../../config/";
import {displayDistance} from "../../../helper/index";
const imageWidth = (Dimensions.get('window').width / 3 ) - 10 ;

class DetailTileContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorImage: ""
    };
  }

  /**
   * @method loadFallback
   * @description to set the ni iMage if no data i9s there
   */
  loadFallback = () => {
    this.setState({
      errorImage: require("../../../assets/images/noimage.png")
    });
  };

  /**
   * @method render
   * @description to render component
   */
  render() {
    const props = this.props;
    const { errorImage } = this.state;
    const sourceImage =
      props.retailerImagePath != ""
        ? { uri: API.DownloadImage + "?key=" + props.retailerImagePath }
        : require("../../../assets/images/noimage.png");

     return (
      <View style={{ flexDirection: "row", paddingTop:5}}>
        <View style={[innerStyle.retailerImage, {flex: 1}]}>
          <Image
            onError={() => this.loadFallback()}
            source={errorImage != "" ? errorImage : sourceImage}
            style={{
              width: imageWidth,
              height: imageWidth - 20
            }}
          />
        </View>
        <View style={[innerStyle.retailerAddress, {flex: 2}]}>
          <View
            style={{
              alignItems: "flex-start",
              flex: 2,
              marginTop: 2,
              marginLeft: 10
            }}
          >
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                  {displayDistance(props.retailerDistance)}
                  {LABELS.METER_FROM_YOU}
              </Text>
            <Text>{props.retailerAddress}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text>{LABELS.LOYALTY_NUMBER_TEXT}</Text>
              <Text>{`${props.loyaltyNumber}`}</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              marginRight: 5,
              marginTop: 2
            }}
          >
            <Image
              source={require("../../../assets/images/Google-map.png")}
              style={{
                width: 40,
                height: 40
              }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  retailerImage: {
    flex: 0.5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5
  },
  retailerAddress: { flex: 0.5, flexDirection: "row" },
  innerText: {
    color: "#000000",
    fontFamily: fontRegular,
    padding: 5
  }
});

export default withNavigation(DetailTileContent);
