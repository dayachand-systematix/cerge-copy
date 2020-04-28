/* eslint-disable no-confusing-arrow */
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Text } from "native-base";
import moment from "moment";
import { Rating } from "react-native-ratings";
import { Cards, LabelBox, LineText, LinkText } from "../../common";
import styles from "../../../assets/styles";
import { displayValue } from "../../../helper";
import { LABELS } from "../../../languageConstants";
import { DATE_FORMAT, TIME_FORMAT } from "../../../config";

class ReviewList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { star: "" };
  }

  /**
   * @method onPressRateText
   *@description call for navigate route
   */
  onPressRateText = shoppingHistory => {
    this.props.screenProps.navigation.navigate("Rate", { shoppingHistory });
  };

  /**
   * @method ratingCompleted
   *@description called for console rating
   */
  ratingCompleted = star => {
    this.setState({ star });
  };

  /**
   * @method displayShoppingInterval
   *@description will display time interval
   */
  displayShoppingInterval = (enteredDate, leaveDate) =>
    moment(leaveDate).diff(moment(enteredDate), "minutes") !== "" &&
      !isNaN(moment(leaveDate).diff(moment(enteredDate), "minutes")) &&
      moment(leaveDate).diff(moment(enteredDate), "minutes") !== null
      ? `${(moment.utc(leaveDate).local()).diff((moment.utc(enteredDate).local()), "minutes")} ${"mins"}`
      : "N/A";

  /**
   * @method walkedInTime
   * @description will display in time
   */
  walkedInTime = enteredDate => {
    // Converting the UTC/server to local time
    //let local = moment.utc(enteredDate).local().format('YYYY MM DD HH:mm:ss');
    return enteredDate !== "" && enteredDate !== null
      ? `${displayValue(moment.utc(enteredDate).local().format(TIME_FORMAT))}`
      : 'N/A';
  };

  /**
   * @method walkedOutTime
   * @description will display out time
   */
  walkedOutTime = leaveDate => {
    return leaveDate !== "" && leaveDate !== null
      ? `${displayValue(moment.utc(leaveDate).local().format(TIME_FORMAT))}`
      : "N/A";
  }

  /**
  * @method walkedInDate
  * @description will display the date
  */
  walkedInDate = date =>
    date !== "" && date !== null
      ? displayValue(moment.utc(date).local().format(DATE_FORMAT))
      : "N/A";

  render() {
    const { item } = this.props;
    return (
      <Cards>
        <LineText
          weight={"semiBold"}
          style={{
            backgroundColor: "#000000",
            color: "#FFFFFF",
            height: 45,
            fontSize: 24,
            fontFamily: fontBoldItalic,
            paddingLeft: 10
          }}
          numberOfLines={1}
        >
          {item.retailStore && item.retailStore.retailer
            ? displayValue(item.retailStore.retailer.businessName)
            : "N/A"}
        </LineText>
        <View style={[styles.formRows, { padding: 10 }]}>
          <View style={[styles.formCols]}>
            <LabelBox
              ValColor={"#000000"}
              labColor={"#808080"}
              value={this.walkedInDate(item.enteredDate)}
              label={LABELS.DATE}
              isInline={false}
            />
          </View>
          <View style={styles.formCols}>
            <LabelBox
              ValColor={"#000000"}
              labColor={"#808080"}
              value={this.walkedInTime(item.enteredDate)}
              label={LABELS.WALKED_IN}
              isInline={false}
            />
          </View>
          <View style={[styles.formCols]}>
            <LabelBox
              ValColor={"#000000"}
              labColor={"#808080"}
              value={this.walkedOutTime(item.leaveDate)}
              label={LABELS.WALKED_OUT}
              isInline={false}
            />
            <Text style={{ color: "#0076D9", fontSize: 12 }}>
              {this.displayShoppingInterval(item.enteredDate, item.leaveDate)}
            </Text>
          </View>
          <View style={[styles.formCols]}>
            {(item.star !== "" && (
              <View>
                <Text style={{ color: "#808080", marginBottom: 4 }}>
                  {LABELS.RATING}
                </Text>
                <Rating
                  ratingCount={item.star * 1}
                  imageSize={16}
                  fractions={1}
                  readonly
                  startingValue={item.star * 1}
                  onFinishRating={this.ratingCompleted}
                />
              </View>
            )) || (
                <TouchableOpacity
                  style={{
                    borderColor: "#000000",
                    borderStyle: "solid",
                    backgroundColor: "blue",
                    opacity: 1,
                    color: "#FFFFFF"
                  }}
                  onPress={() => this.onPressRateText(item)}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      textAlign: "center",
                      padding: 5
                    }}
                  >
                    {LABELS.RATE}
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </View>
        <View style={[styles.formRows, { padding: 20 }]}>
          <View style={styles.formCols}>
            <LinkText
              textColorCode={"#0076D9"}
              linkTextData={LABELS.INVITATION_RECIEVED}
              linkNavigation={"Invitations"}
              props={this.props.navigation}
              style
            />
          </View>
          <View
            style={[
              styles.formCols,
              { flexDirection: "row", maxWidth: 100, marginRight: -6 }
            ]}
          >
            <Text>{LABELS.SHARE}</Text>
            <TouchableOpacity
              style={{ marginLeft: 9 }}
              onPress={this.props.onPressShareButton}
            >
              <Image
                source={require("../../../assets/images/share.png")}
                style={{
                  width: 25,
                  height: 25
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Cards>
    );
  }
}

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 */
export default connect(null, {})(ReviewList);
