import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import CustomizedSnackbars from "../components/atoms/CustomizedSnackbars";
import CircularIndeterminate from "../components/atoms/CircularIndeterminate";
import { signInErr, signUpErr } from "../components/modules/messages";
import { useSelectDatas, usePostData } from "../components/queryhooks/index";

const AuthUserContext = createContext(null);
const AuthOperationContext = createContext({
  signin: (_) => console.error("Providerが設定されていません"),
  signup: (_) => console.error("Providerが設定されていません"),
  signout: () => console.error("Providerが設定されていません"),
});
const UserReroadUsersContext = createContext({
  reroadUser: (_) => console.error("設定されていません"),
});

const AuthUserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  //ユーザー情報取得hook
  const [{ data: usData, isLoading: usLoaging }, setUsCondition] =
    useSelectDatas();

  //ユーザー情報登録hook
  const [{ id }, setusPData] = usePostData();

  const [formData, setFroemData] = useState(null);

  const [user, userDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add":
        return [...state, { ...action.data }];
      case "put":
        const st = state.filter((e) => e.id !== action.data.id);
        return [...st, { ...action.data }];
      case "replace":
        return [...action.data];
      default:
        return state;
    }
  }, []);

  useEffect(() => {
    if (!usData) return;
    userDispatch({
      ...{
        type: "replace",
        data: usData,
      },
    });
  }, [usData]);

  //ユーザー情報取得
  useEffect(() => {
    const fetch = () => {
      setUsCondition({
        type: "user",
        param: "",
      });
    };
    fetch();
  }, [setUsCondition]);

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

  const signin = useCallback(
    (mail, password) => {
      if (!user) return;
      //サインイン処理 DB照合
      const targetUser = user.find(
        (e) => e.mail === mail && e.password === password
      );
      if (targetUser) {
        setAuthUser([targetUser]);
      } else {
        setSnackbar({ open: true, severity: "error", message: signInErr });
      }
    },
    [user]
  );

  const signup = (data) => {
    setFroemData({ ...data });
    //サインオン処理 DB照合
    const mail = data.mail;
    const password = data.password;
    const name = data.name;
    const otherTargetUser = user.find((e) => e.mail === mail);
    if (!otherTargetUser) {
      setusPData({
        type: "user",
        data: {
          id: null,
          name: name,
          mail: mail,
          password: password,
          record: {
            createDate: "",
            recordDate: "",
          },
        },
      });
    } else {
      setSnackbar({ open: true, severity: "error", message: signUpErr });
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    if (formData) {
      const targetUser = {
        id: id,
        name: formData.name,
        mail: formData.mail,
        password: formData.password,
        record: {
          createDate: "",
          recordDate: "",
        },
      };
      setAuthUser([targetUser]);
    }
  }, [id, signin, formData]);

  const signout = () => {
    //ログアウト処理
    setAuthUser(null);
  };

  return (
    <AuthOperationContext.Provider value={{ signin, signup, signout }}>
      <UserReroadUsersContext.Provider value={{ userDispatch }}>
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
      </UserReroadUsersContext.Provider>
    </AuthOperationContext.Provider>
  );
};

export const useAuthUser = () => useContext(AuthUserContext);
export const useSignin = () => useContext(AuthOperationContext).signin;
export const useSignup = () => useContext(AuthOperationContext).signup;
export const useSignout = () => useContext(AuthOperationContext).signout;
export const useReroadUsers = () => useContext(UserReroadUsersContext);

export default AuthUserProvider;
