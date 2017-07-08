import { ListMasterPage } from './list-master/list-master';
import { WelcomePage } from './welcome/welcome';
import { ResetpwPage } from './resetpw/resetpw';
import { LoginPage } from './login/login';
// The page the user lands on after opening the app and without a session
export const FirstRunPage = LoginPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = ListMasterPage;
