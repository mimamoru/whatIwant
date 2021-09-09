import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthUserProvider, { useAuthUser } from "./context/AuthUserContext";
import UserComparesProvider from "./context/UserComparesContext";
import UserItemsProvider from "./context/UserItemsContext";
import Home from "./components/pages/Home";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Search from "./components/pages/Search";
import Register from "./components/pages/Register";
import Edit from "./components/pages/Edit";
import History from "./components/pages/History";
import Mypage from "./components/pages/Mypage";

// PrivateRouteの実装
const PrivateRoute = ({ ...props }) => {
  const authUser = useAuthUser();
  const isAuthenticated = authUser !== null;
  if (isAuthenticated) {
    return <Route {...props} />;
  } else {
    console.log(`ログインしてください`);
    return <Redirect to={{ pathname: "/signin" }} />;
  }
};

const UnAuthRoute = ({ ...props }) => {
  const authUser = useAuthUser();
  const isAuthenticated =
    authUser !== null && authUser !== undefined && authUser?.length > 0;
  if (isAuthenticated) {
    console.log(`すでにログイン済みです`);
    return <Redirect to={"/mypage"} />;
  } else {
    return <Route {...props} />;
  }
};

const App = () => {
  return (
    <AuthUserProvider>
      <BrowserRouter>
        <Switch>
          <UnAuthRoute exact path="/" component={Home} />
          <UnAuthRoute exact path="/signin" component={SignIn} />
          <UnAuthRoute exact path="/signup" component={SignUp} />
          <UserItemsProvider>
            <UserComparesProvider>
              <PrivateRoute path="/mypage" component={Mypage} exact />
              <PrivateRoute path="/search" component={Search} exact />
              <PrivateRoute path="/register" component={Register} exact />
              <PrivateRoute path="/edit" component={Edit} exact />
              <PrivateRoute path="/history" component={History} exact />
            </UserComparesProvider>
          </UserItemsProvider>
        </Switch>
      </BrowserRouter>
    </AuthUserProvider>
  );
};

export default App;
