/**
 * This is the one and only styles.js that will be maintained for the project
 * Any changes to related to the themes can be done here
 * We can define all the necessary variables like primaryColor, deviceHeight etc in this file
 * To make our style more clear, we can use module prefixes in style name.
 */

import { StyleSheet, Platform, Dimensions } from "react-native";
import { Fonts } from "../utils/Fonts";

var headerHeight = Platform.OS === "ios" ? 108 : 100;
global.deviceWidth = Dimensions.get("window").width;
global.deviceHeight = Dimensions.get("window").height - headerHeight;
global.actualDeviceHeight = Dimensions.get("window").height;

global.blueColor = "#2932bf";
global.redColor = "#ED2541";
global.bgColoe = "#f3f5f7";
global.bgGrey = "#e7eaed";
global.whiteColor = "#fff";
global.titleColor = "#323B49";
global.grayTxt = "#7f8c9f";
global.greenTxt = "#008D00";
global.labelColor = "#4a5264";
global.valColor = "#000000";
global.secondaryBtnColor = "#7f8c9f";
global.inputBrdColor = "#d8dee9";
global.InputLabelColor = "#727D96";
global.primaryBtn = "#2932bf";
global.AlizarinColor = "#e74c3c";
global.CarrotColor = "#e67e22";
global.titleBg = "#edf0f1";

global.fontExtraLight = Fonts.TitilliumWebExtraLight;
global.fontLight = Fonts.TitilliumWebLight;
global.fontRegular = Fonts.TitilliumWeb;
global.fontSemiBold = Fonts.TitilliumWebSemiBold;
global.fontBold = Fonts.TitilliumWebBold;
global.fontBoldItalic = Fonts.PlayFairDisplayBoldItalic;

global.marginTop = {
  Five: { marginTop: 5 },
  Ten: { marginTop: 10 },
  Fifteen: { marginTop: 15 },
  Twenty: { marginTop: 20 }
};
global.marginLeft = {
  Five: { marginLeft: 5 },
  Ten: { marginLeft: 10 },
  Fifteen: { marginLeft: 15 },
  Twenty: { marginLeft: 20 }
};
global.marginBottom = {
  Five: { marginBottom: 5 },
  Ten: { marginBottom: 10 },
  Fifteen: { marginBottom: 15 },
  Twenty: { marginBottom: 20 }
};
global.marginRight = {
  Five: { marginRight: 5 },
  Ten: { marginRight: 10 },
  Fifteen: { marginRight: 15 },
  Twenty: { marginRight: 20 }
};
global.paddingTop = {
  Five: { paddingTop: 5 },
  Ten: { paddingTop: 10 },
  Fifteen: { paddingTop: 15 },
  Twenty: { paddingTop: 20 },
  Thirty: { paddingTop: 30 }
};
global.paddingLeft = {
  Five: { paddingLeft: 5 },
  Ten: { paddingLeft: 10 },
  Fifteen: { paddingLeft: 15 },
  Twenty: { paddingLeft: 20 }
};
global.paddingBottom = {
  Five: { paddingBottom: 5 },
  Ten: { paddingBottom: 10 },
  Fifteen: { paddingBottom: 15 },
  Twenty: { paddingBottom: 20 }
};
global.paddingRight = {
  Five: { paddingRight: 5 },
  Ten: { paddingRight: 10 },
  Fifteen: { paddingRight: 15 },
  Twenty: { paddingRight: 20 }
};
export default StyleSheet.create({
  paddingTen: {
    padding: 10
  },
  w100: {
    width: "100%"
  },
  w50: {
    width: "50%"
  },
  w25: {
    width: "25%"
  },
  w75: {
    width: "75%"
  },
  row: {
    flexDirection: "row"
  },
  column: {
    flexDirection: "column"
  },
  verticalCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  verticalCenterLeft: {
    flex: 1,
    justifyContent: "center"
  },
  verticalCenterRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  alignBottom: {
    flex: 1,
    justifyContent: "flex-end"
  },
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2
  },
  linkTxt: {
    color: "#2080E8"
  },
  flexOne: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  spaceBetween: {
    justifyContent: "space-between"
  },
  formBox: {
    padding: 15
  },
  checkboxLabel: {
    fontFamily: fontBoldItalic,
    color: "#000000",
    fontSize: 24
  },
  CheckBox: {
    borderColor: "#AEACAE",
    borderRadius: 3,
    width: 20,
    height: 20
  },
  CheckBoxChecked: {
    borderRadius: 3,
    width: 20,
    height: 20
  },
  switchLabel: {
    fontSize: 18,
    fontFamily: fontRegular,
    color: "#2C3138"
  },
  switchLabelSml: {
    fontSize: 16,
    fontFamily: fontRegular,
    color: "#2C3138"
  },
  m20: {
    margin: 20
  },
  selfCenter: {
    alignSelf: "center"
  },
  errorTextStyle: {
    fontSize: 13,
    marginLeft: 3,
    color: "red",
    fontFamily: fontSemiBold,
    marginTop: -8
  },
  errorSelectStyle: {
    position: "relative",
    marginTop: 0,
    top: -18
  },
  buttonTextAuth: {
    color: "white",
    fontFamily: fontRegular,
    fontSize: 18
  },
  buttonText: {
    color: "white",
    fontFamily: fontRegular,
    fontSize: 16
  },
  WhiteButtonText: {
    fontFamily: fontSemiBold,
    color: "#333",
    fontSize: 20
  },
  confirmContainer: {
    flex: 1,
    alignItems: "center",
    width: deviceWidth,
    height: deviceHeight,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#726CB2",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 3
    },
    fontFamily: fontRegular,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 3,
    width: "100%"
  },
  buttonWhite: {
    backgroundColor: "#fff"
  },
  buttonBlack: {
    backgroundColor: "#000"
  },
  buttonFull: {
    width: "100%"
  },
  text: {
    color: "#333",
    fontSize: 18,
    fontFamily: fontRegular
  },
  title: {
    fontSize: 16,
    fontFamily: fontSemiBold
  },
  listItemTitle: {
    fontSize: 16,
    fontFamily: fontRegular,
    color: "#f26568"
  },
  flexDirectionStyle: {
    flexDirection: "row"
  },
  actionButtons: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  postActionButtonWrap: {
    alignSelf: "flex-end",
    paddingRight: 3,
    marginTop: 5
  },

  loaderWrap: {
    position: "absolute",
    width: deviceWidth,
    height: actualDeviceHeight,
    zIndex: 999,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    top: 0,
    justifyContent: "center"
  },
  loader: {
    alignSelf: "center",
    zIndex: 999
  },
  container: {
    backgroundColor: "#F5F7F9"
  },
  footerTxt: {
    textAlign: "center",
    fontSize: 13,
    color: "#86929F",
    fontFamily: fontRegular
  },
  addButton: {
    fontSize: 18,
    padding: 5,
    backgroundColor: "#000",
    position: "absolute",
    right: 0,
    top: 70,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3
  },
  commonButton: {
    padding: 5,
    backgroundColor: "#000",
    paddingLeft: 9,
    paddingRight: 9,
    borderRadius: 3,
    color: "#fff",
    paddingTop: 0,
    marginTop: 8
  },
  addButtonWrap: {
    position: "relative",
    marginBottom: 55,
    paddingTop: 0,
    paddingBottom: 0
  },
  plusIcon: {
    fontSize: 16,
    color: "#fff",
    marginRight: 5,
    marginTop: 2
  },
  buttonTextSmall: {
    fontSize: 14,
    color: "#fff"
  },
  pRelative: {
    position: "relative"
  },
  deleteImgIcon: {
    position: "absolute",
    right: 3,
    top: 18,
    zIndex: 999,
    color: "#fff",
    width: 24,
    height: 24,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderColor: "#87939F",
    borderStyle: "solid",
    borderWidth: 1
  },
  btnCstm: {
    minHeight: 55
  },
  profileBoxBig: {
    width: 224,
    height: 80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  profileBoxImg: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  poster: {
    width: "100%",
    height: 180,
    margin: 5,
    marginTop: 10
  },
  cstmDeleteImg: {
    color: "#87939F",
    fontSize: 14,
    marginLeft: 4,
    marginTop: 3
  },
  // Modal Style
  modal: {
    height: "auto",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",

  },
  modalInnerBox: {
    width: 320,
    height: 320,
    /* backgroundColor: "#FFF", */
    position: "relative",
    paddingBottom: 20,
    borderColor: '#FFFFFF',
    borderWidth: 1
  },
  modalHead: {
    backgroundColor: "#FFF",
    textAlign: "center",
    padding: 15,
    paddingTop: 12,
    paddingBottom: 16
  },
  optionLabel: {
    fontSize: 18,
    color: "#040605",
    textAlign: "center",
    fontFamily: fontSemiBold
  },
  closeIcon: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 0,
    top: 8
  },
  closeIcn: {
    color: "#86929F",
    fontSize: Platform.OS === "ios" ? 34 : 25
  },
  loaderImgWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loaderImg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  doneButton: {
    padding: 5,
    backgroundColor: "#000",
    paddingLeft: 9,
    paddingRight: 9,
    borderRadius: 3,
    color: "#fff",
    paddingTop: 0,
    marginTop: 8,
    width: 80,
    marginLeft: "auto",
    marginRight: "auto"
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center"
  },
  itemCenter: {
    alignItems: "center"
  },
  bgGray: {
    backgroundColor: "#E8E9ED"
  },
  bgWhite: {
    backgroundColor: "#fff"
  },
  // For Grid View
  gridRows: {
    alignItems: "flex-start",
    flexDirection: "row",
    /*   paddingTop: 10,
      paddingBottom: 5, */
    marginLeft: -10,
    marginRight: -10
  },
  gridCols: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },

  gridRowsGutterSpaceSmall: {
    marginLeft: -5,
    marginRight: -5
  },
  gridColsGutterSpaceSmall: {
    paddingLeft: 5,
    paddingRight: 5
  },
  mainTitle: {
    fontSize: 16,
    color: "#040605",
    fontFamily: fontRegular
  },
  smallHeading: {
    color: "#86929F",
    fontSize: 11,
    paddingTop: 4
  },
  // Map screen
  mapPin: {
    backgroundColor: "#EFEFEF",
    width: 60,
    height: 60,

    // maxHeight: 60,
    // maxWitdh: 60,
    borderRadius: 50
  },
  mapPinIcon: {
    width: 20,
    height: 29
    // maxHeight: 29,
    //  maxWitdh: 29
  },
  mapBox: {
    padding: 10,
    backgroundColor: "#fff",
    paddingTop: 25,
    paddingBottom: 25
  },
  mapHeader: {
    padding: 10,
    paddingTop: 12,
    paddingBottom: 15,
    marginBottom: 8,
    backgroundColor: "#fff"
  },
  // List View
  listView: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomColor: "#E8E9ED",
    borderStyle: "solid",
    borderBottomWidth: 1
  },
  listThumbnailImage: {
    maxWidth: 45,
    width: 45,
    padding: 2
  },
  inputGroup: {
    padding: 10
  },
  closedText: {
    fontSize: 12,
    color: "#F31E1E"
  },
  img70Round: { width: 70, height: 70, borderRadius: 70 / 2 },

  formRows: {
    alignItems: "flex-start",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
    marginLeft: -10,
    marginRight: -10
  },
  formCols: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },

  titleText: {
    color: "#000000",
    marginTop: 10,
    fontFamily: fontBoldItalic,
    fontSize: 24,
    marginLeft: 10
  }
});
