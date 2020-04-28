import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Container, Content } from 'native-base';
import { AirbnbRating } from 'react-native-ratings';
import { LABELS } from '../../../languageConstants';
import styles from '../../../assets/styles';
import { ValidationComponent, Toast, displayValue } from '../../../helper';
import { Text, Button, HeaderContent, Cards, Loader } from '../../common';
import {
  setShoppingRatingAction,
  getShoppingHistoryAction,
} from '../../../actions/Review';
import { MESSAGES, STATUS_CODES } from '../../../config';

class Rate extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      shoppingHistory: {},
      star: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (
      navigation &&
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.shoppingHistory
    ) {
      this.setState({
        shoppingHistory: navigation.state.params.shoppingHistory
      });
    }
  }

  /**
   * @method ratingCompleted
   *@description called for console rating
   */
  ratingCompleted = star => {
    this.setState({ star });
  };

  /**
   * @method onPressCancelImage
   *@description call for navigate route
   */
  onPressCancelImage = () => {
    this.props.navigation.navigate('Reviews');
  };

  /**
   * @method onPressSubmitButton
   *@description call for action creator
   */
  onPressSubmitButton = () => {
    const { shoppingHistory, star } = this.state;
    if (star > 0) {
      const requestData = {
        shoppingHistoryID: shoppingHistory.shoppingHistoryID,
        star: star.toString()
      };
      this.props.setShoppingRatingAction(requestData, response => {
        if (
          response &&
          response.data &&
          response.data.code &&
          response.data.code == STATUS_CODES.OK
        ) {
          Toast.showToast(MESSAGES.RATING_SUCCESS, 'success');
          this.props.navigation.navigate('Reviews');
        }
      });
    } else {
      Toast.showToast(MESSAGES.RATING_VALIDATION, 'warning');
    }
  };

  /**
   * @method render
   * @description to render component
   */
  render() {
    const { shoppingHistory } = this.state;
    console.log('distance111', shoppingHistory);
    return (
      <Container style={innerStyle.container}>
        <StatusBar backgroundColor="rgb(0, 0, 0)" barStyle="light-content" hidden={false} />
        <Loader isLoading={this.props.reviewLoading} />
        <HeaderContent
          title={LABELS.USERNAME}
          subTitle={LABELS.SHOPPING_RATING_SUB_TITLE}
          blackTheme={false}
          showProfileSection={false}
        />
        <Content>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row-reverse' }}
            onPress={this.onPressCancelImage}
          >
            <Image
              source={require('../../../assets/images/Cancle.png')}
              style={{
                width: 40,
                height: 40,
                left: 20,
                marginBottom: 10
              }}
            />
          </TouchableOpacity>
          <Text style={innerStyle.titleText}>{`${LABELS.RATING_HEADING}${shoppingHistory && shoppingHistory.retailStore && shoppingHistory.retailStore.store && shoppingHistory.retailStore.store.storeInfo ? displayValue(shoppingHistory.retailStore.store.storeInfo.storeName) : 'N/A'}`}</Text>
          <SafeAreaView style={styles.flex}>
            <ScrollView
              style={styles.flex}
              contentContainerStyle={styles.center}
            >
              <Cards containerStyle={styles.card}>
                <AirbnbRating
                  showRating={false}
                  defaultRating={0}
                  minValue={0}
                  isDisabled={false}
                  starContainerStyle={{
                    backgroundColor: '#000000',
                    width: '100%'
                  }}
                  onFinishRating={this.ratingCompleted}
                />
              </Cards>
            </ScrollView>
          </SafeAreaView>
          <View style={[styles.flexOne, innerStyle.mainPWwrap]}>
            <View
              style={[
                styles.gridRows,
                marginTop.Five,
                paddingLeft.Ten,
                paddingRight.Ten,
                styles.verticalCenter
              ]}
            />
            <Button
              title={LABELS.SUBMIT_RATING}
              onPress={() => this.onPressSubmitButton()}
            />
            <Button
              title={LABELS.NOT_NOW}
              onPress={() => this.onPressCancelImage()}
            />
          </View>
        </Content>
      </Container>
    );
  }
}
const mapStateToProps = ({ review }) => {
  const { reviewLoading } = review;
  return { reviewLoading };
};

export default connect(mapStateToProps, {
  setShoppingRatingAction,
  getShoppingHistoryAction
})(Rate);

const innerStyle = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    opacity: 1
  },
  text: {
    textAlign: 'left',
    letterSpacing: 1.35,
    color: '#FFFFFF',
    left: 10
  },
  mainPWwrap: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15
  },
  titleText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontFamily: fontBoldItalic,
    fontSize: 24,
    marginLeft: 10
  },
  flex: {
    flex: 1
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  headingContainer: {
    paddingBottom: 30
  },
  card: {
    width: '85%',
    marginBottom: 20,
    backgroundColor: '#000000'
  }
});
