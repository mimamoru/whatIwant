import React, { createContext, useContext, useState, useCallback } from "react";
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

  const signin = (data) => {
    //ログイン処理 DB照合
    setUsCondition({
      type: "user",
      param: `?mail=${data.mail}&password=${data.password}`,
    });
    if (usErr) {
      setSnackbar({ open: true, severity: "error", message: signInErr });
      return;
    }
    if (user) setAuthUser(user);
  };

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
