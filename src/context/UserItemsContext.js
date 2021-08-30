import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelectDatas } from "../components/queryhooks/index";
import { useAuthUser } from "./AuthUserContext";
const UserItemsContext = createContext(null);

const UserItemsProvider = ({ children }) => {
  //商品情報取得hook(複数)
  const [
    { data: items, isLoading: itsLoaging, isError: itsErr },
    setItCondition,
  ] = useSelectDatas();
  const [reroadItems, setReroadItems] = useState(true);

  //商品情報取得(複数)
  useEffect(() => {
    const fetch = () => {
      if (reroadItems && useAuthUser) {
        setItCondition({
          ...{
            type: "item",
            param: "&delete=false",
          },
        });
        setReroadItems(false);
      }
    };
    fetch();
  }, [setItCondition, reroadItems]);

  const value = {
    items,
    itsLoaging,
    itsErr,
    setReroadItems,
  };

  return (
    <UserItemsContext.Provider value={value}>
      {children}
    </UserItemsContext.Provider>
  );
};

export const useUserItems = () => useContext(UserItemsContext);

export default UserItemsProvider;
