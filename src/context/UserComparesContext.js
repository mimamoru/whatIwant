import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useSelectDatas } from "../components/queryhooks/index";
import { useAuthUser } from "./AuthUserContext";
const UserComparesContext = createContext(null);
const UserReroadComparesContext = createContext({
  reroadCompare: (_) => console.error("設定されていません"),
});

const UserComparesProvider = ({ children }) => {
  //比較情報取得hook
  const [
    { data: cpData, isLoading: cpLoaging, isError: cpErr },
    setCpCondition,
  ] = useSelectDatas();

  const [compares, compareDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add":
        return [...state, ...action.data];
      case "delete":
        return [...state.filter((e) => action.data.indexOf(e) === -1)];
      case "replace":
        return [...action.data];
      default:
        return state;
    }
  }, []);

  //商品情報取得(複数)
  useEffect(() => {
    if (!cpData) return;
    compareDispatch({...{
      type: "replece",
      data: cpData,
    }});
  }, [cpData]);

  //比較情報取得
  useEffect(() => {
    const fetch = () => {
      if (useAuthUser) {
        setCpCondition({
          type: "compare",
        });
      }
    };
    fetch();
  }, [setCpCondition]);

  return (
    <UserReroadComparesContext.Provider value={{ compareDispatch }}>
      <UserComparesContext.Provider
        value={{
          compares,
          cpLoaging,
          cpErr,
        }}
      >
        {children}
      </UserComparesContext.Provider>
    </UserReroadComparesContext.Provider>
  );
};

export const useUserCompares = () => useContext(UserComparesContext);
export const useReroadCompares = () => useContext(UserReroadComparesContext);

export default UserComparesProvider;
