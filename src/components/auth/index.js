import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './login';
import LoginAndSignUp from './login/LoginAndSignUp';
import ForgetPassword from './forget-password';
import BasicProfile from '../app/initial-setup/Profile';
import HatAccount from './login/HatAccount';
import PrivacyPolicy from './login/PrivacyPolicy';
import TermCondition from './login/TermCondition';

const MainNavigator = createStackNavigator(
  {
    Login,
    ForgetPassword,
    LoginAndSignUp,
    InitialProfile: {
      screen: BasicProfile,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    HatAccount,
      PrivacyPolicy,
      TermCondition
  },
  {
    headerMode: 'none'
  }
);

const AuthStack = createAppContainer(MainNavigator);
export default AuthStack;
