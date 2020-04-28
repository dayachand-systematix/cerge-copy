import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import AppStack from './components/app';
import AuthStack from './components/auth';
import { Loader } from '../src/components/common/';
import NavigationService from './services/navigator';

console.disableYellowBox = true;

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

const NavApp = createAppContainer(AppNavigator);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: null
    };
  }

  componentDidMount() {
    setTimeout(() => SplashScreen.hide(), 1000);
  }

  renderLoader = () => {
    if (this.props.loading) {
      return <Loader isLoading={this.props.loading} />;
    }
    return false;
  };
  render() {
    return [
      <NavApp
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
        key={'1'}
      />,
      this.renderLoader()
    ];
  }
}

/**
 * @method mapStateToProps
 * @description return state to component as props
 * @param {*} state
 */
function mapStateToProps({ auth }) {
  const { loading } = auth;
  return {
    loading
  };
}

/**
 * @method connect
 * @description connect with redux
 * @param {function} mapStateToProps
 */
export default connect(
  mapStateToProps,
  null
)(App);
