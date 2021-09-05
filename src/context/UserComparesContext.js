import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelectDatas } from "../components/queryhooks/index";
import { useAuthUser } from "./AuthUserContext";
const UserComparesContext = createContext(null);
const UserReroadComparesContext = createContext({
  reroadCompare: (_) => console.error("設定されていません"),
});

const UserComparesProvider = ({ children }) => {
  //比較情報取得hook
  const [
    { data: compares, isLoading: cpLoaging, isError: cpErr },
    setCpCondition,
  ] = useSelectDatas();
  const [reroadCompares, setReroadCompares] = useState(true);

  const reroadCompare = () => {
    //リロード処理
    setReroadCompares(true);
  };

  //比較情報取得
  useEffect(() => {
    const fetch = () => {
      if (reroadCompares && useAuthUser) {
        setCpCondition({
          type: "compare",
        });
        setReroadCompares(false);
      }
    };
    fetch();
  }, [setCpCondition, reroadCompares]);

  return (
    <UserReroadComparesContext.Provider value={reroadCompare}>
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
