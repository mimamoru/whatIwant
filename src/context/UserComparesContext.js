import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelectDatas } from "../components/queryhooks/index";
import { useAuthUser } from "./AuthUserContext";
const UserComparesContext = createContext(null);

const UserComparesProvider = ({ children }) => {
  //比較情報取得hook
  const [
    { data: compares, isLoading: cpLoaging, isError: cpErr },
    setCpCondition,
  ] = useSelectDatas();
  const [reroadCompares, setReroadCompares] = useState(true);

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
  const value = {
    compares,
    cpLoaging,
    cpErr,
    setReroadCompares,
  };
  return (
    <UserComparesContext.Provider value={value}>
      {children}
    </UserComparesContext.Provider>
  );
};

export const useUserCompares = () => useContext(UserComparesContext);

export default UserComparesProvider;
