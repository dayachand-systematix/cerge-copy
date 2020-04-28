import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Text } from "native-base";
import { checkFontSize, checkFontWeight } from "../../../utils/ThemeUtils";

/**
 * LineText Tag
 * style props is defind the text
 * style={1 or 2 or 3}
 */
export default class LineText extends Component {
  checkColor = () => this.props.color && { color: this.props.color };

  checkTaxtAlign = () =>
    this.props.textAlign && { textAlign: this.props.textAlign };

  printText = s => {
    if (this.props.textTransform) {
      if (typeof s !== "string") return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return s;
  };

  render() {
    return (
      <Text
        style={[
          innerStyle.Text,
          checkFontSize(this.props.size),
          this.checkColor(),
          checkFontWeight(this.props.weight),
          this.checkTaxtAlign(),
          this.props.style
        ]}
        numberOfLines={this.props.numberOfLines}
      >
        {this.printText(this.props.children)}
      </Text>
    );
  }
}

const innerStyle = StyleSheet.create({
  Text: {
    // fontWeight: fontRegular,
    fontSize: 10,
    color: "#7C828A"
    //color: BodyColor
  }
});
