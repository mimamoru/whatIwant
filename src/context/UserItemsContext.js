import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelectDatas } from "../components/queryhooks/index";
import { useAuthUser } from "./AuthUserContext";
const UserItemsContext = createContext(null);
const UserReroadItemsContext = createContext({
  reroadItem: (_) => console.error("設定されていません"),
});

const UserItemsProvider = ({ children }) => {
  //商品情報取得hook(複数)
  const [
    { data: items, isLoading: itsLoaging, isError: itsErr },
    setItCondition,
  ] = useSelectDatas();
  const [reroadItems, setReroadItems] = useState(true);

  const reroadItem = () => {
    //リロード処理
    setReroadItems(true);
  };

  //商品情報取得(複数)
  useEffect(() => {
    const fetch = () => {
      if (reroadItems && useAuthUser) {
        setItCondition({
          type: "item",
          param: "&delete=false",
        });
        setReroadItems(false);
      }
    };
    fetch();
  }, [setItCondition, reroadItems]);

  return (
    <UserReroadItemsContext.Provider value={reroadItem}>
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
