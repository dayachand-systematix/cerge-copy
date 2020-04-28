import React, { Component } from 'react';
import { AppRegistry, YellowBox, StatusBar, Text } from 'react-native';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import configureStore from './src/configureStore';
import App from './src';
import NetWorkError from './src/components/common/NetWorkError';

StatusBar.setBackgroundColor('#778389');
StatusBar.setBarStyle('dark-content');
StatusBar.setTranslucent(true);
StatusBar.setHidden(false);
const store = configureStore();
console.disableYellowBox = true;
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;


// const _XHR = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest
//
// XMLHttpRequest = _XHR

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
]);

class Cerge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networkStatus: true
    };
  }
  render() {
    return [
      <Provider key={'1'} store={store}>
        <Root>
          <App />
        </Root>
      </Provider>,
      <NetWorkError key={'2'} />
    ];
  }
}
export default Cerge;

AppRegistry.registerComponent('Cerge', () => Cerge);
