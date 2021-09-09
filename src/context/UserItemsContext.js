import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useSelectDatas } from "../components/queryhooks/index";
import { useAuthUser } from "./AuthUserContext";
const UserItemsContext = createContext(null);
const UserReroadItemsContext = createContext({
  reroadItem: (_) => console.error("設定されていません"),
});

const UserItemsProvider = ({ children }) => {
  //商品情報取得hook(複数)
  const [
    { data: itData, isLoading: itsLoaging, isError: itsErr },
    setItCondition,
  ] = useSelectDatas();

  const [items, itemDispatch] = useReducer((state, action) => {
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
    if (!itData) return;
    itemDispatch({
      ...{
        type: "replace",
        data: itData,
      },
    });
  }, [itData]);

  //商品情報取得(複数)
  useEffect(() => {
    const fetch = () => {
      if (useAuthUser) {
        setItCondition({
          type: "item",
          param: "&delete=false",
        });
      }
    };
    fetch();
  }, [setItCondition]);

  return (
    <UserReroadItemsContext.Provider value={{ itemDispatch }}>
      <UserItemsContext.Provider
        value={{
          items,
          itsLoaging,
          itsErr,
        }}
      >
        {children}
      </UserItemsContext.Provider>
    </UserReroadItemsContext.Provider>
  );
};

export const useUserItems = () => useContext(UserItemsContext);
export const useReroadItems = () => useContext(UserReroadItemsContext);
export default UserItemsProvider;
