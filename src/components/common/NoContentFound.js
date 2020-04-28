import React from "react";
import { StyleSheet, Image } from "react-native";
import { View } from "native-base";
import { Text } from "../common";

const NoContentFound = ({ title, customHeigth, customWidth }) => (
  <View style={innerStyle.emptyContainer}>
    <Image
      source={require("../../assets/images/no-record.png")}
      style={{ height: customHeigth, width: customWidth }}
    />
    <Text style={innerStyle.emptyText}>{title}</Text>
  </View>
);
const innerStyle = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    height: 200,
    marginTop: 60,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  emptyText: {
    fontSize: 18
  }
});

export default NoContentFound;
