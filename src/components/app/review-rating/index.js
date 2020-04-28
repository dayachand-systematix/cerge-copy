import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { Container } from 'native-base';
import { LABELS } from '../../../languageConstants';
import { ValidationComponent } from '../../../helper';
import CardReview from './CardReview';
import { HeaderContent, Loader } from '../../common';
import { getShoppingHistoryAction } from '../../../actions/Review';

class Review extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getReviewRatingData = () => {
    this.props.getShoppingHistoryAction(this.props.initialrequestData, false, false, response => {
      console.log(response);
    });
  }

  /**
   * @method render
   * @description to render component
   */
  render() {
    if (this.props) {
      return (
        <Container>
          <StatusBar backgroundColor="rgba(255, 255, 255, 0)" barStyle="dark-content" hidden={false} />
          <NavigationEvents onDidFocus={() => this.getReviewRatingData()} />
          <Loader isLoading={(this.props.reviewLoading && this.props.initialrequestData.pageIndex == 1)} />
          <HeaderContent
            title={LABELS.USERNAME}
            subTitle={LABELS.REVIEW_SUB_TITLE}
            blackTheme
            showProfileSection
            showBugReport
          />
          <CardReview
            reviewList={this.props.reviewList}
            screenProps={this.props}
          />
        </Container>
      );
    }
  }
}
const mapStateToProps = ({ review }) => {
  const { reviewLoading, reviewList, initialrequestData } = review;
  return { reviewLoading, reviewList, initialrequestData };
};

export default connect(mapStateToProps, { getShoppingHistoryAction })(Review);
