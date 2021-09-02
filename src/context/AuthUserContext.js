import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import CustomizedSnackbars from "../components/atoms/CustomizedSnackbars";
import CircularIndeterminate from "../components/atoms/CircularIndeterminate";
import { signInErr } from "../components/modules/messages";
import { useSelectDatas } from "../components/queryhooks/index";

const AuthUserContext = createContext(null);
const AuthOperationContext = createContext({
  signin: (_) => console.error("Providerが設定されていません"),
  signout: () => console.error("Providerが設定されていません"),
});

const AuthUserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  //ユーザー情報取得hook
  const [{ data: user, isLoading: usLoaging, isError: usErr }, setUsCondition] =
    useSelectDatas();
  //スナックバーの状態管理
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  //スナックバーを閉じる処理
  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackbar({ ...snackbar, open: false });
    },
    [snackbar]
  );

  const signin = (mail, password) => {
    //ログイン処理 DB照合
    setUsCondition({
      type: "user",
      param: `?mail=${mail}&password=${password}`,
    });
  };

  useEffect(() => {
    console.log(usErr, user);
    if (!user) {
      return;
    }
    if (user.length > 0) {
      setAuthUser(() => user);
    } else {
      setSnackbar({ open: true, severity: "error", message: signInErr });
    }
  }, [usErr, user]);

  const signout = () => {
    //ログアウト処理
    setAuthUser(null);
  };

  return (
    <AuthOperationContext.Provider value={{ signin, signout }}>
      <AuthUserContext.Provider value={authUser}>
        <CustomizedSnackbars
          open={snackbar.open}
          handleClose={handleClose}
          severity={snackbar.severity}
          message={snackbar.message}
        />
        {usLoaging && <CircularIndeterminate component="div" />}
        {children}
      </AuthUserContext.Provider>
    </AuthOperationContext.Provider>
  );
};

export const useAuthUser = () => useContext(AuthUserContext);
export const useSignin = () => useContext(AuthOperationContext).signin;
export const useSignout = () => useContext(AuthOperationContext).signout;

export default AuthUserProvider;
