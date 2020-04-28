import React from "react";
import { StyleSheet, View } from "react-native";

const Cards = props => <View style={innerStyle.cards}>{props.children}</View>;
export { Cards };
const innerStyle = StyleSheet.create({
  cards: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    /* zIndex: 1 */
  }
});
