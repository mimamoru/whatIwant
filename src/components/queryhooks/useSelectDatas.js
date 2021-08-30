import { useState, useEffect } from "react";
import { selectDatas } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const useSelectDatas = () => {
  const authUser = useAuthUser();
  const [data, setData] = useState(null);
  const [condition, setCondition] = useState({ type: "", param: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const select = async () => {
      const { type, param } = condition;
      let con;
      if (!type) return;
      setIsError(false);
      setIsLoading(true);
      if (type === "user") {
        con = param;
      } else {
        if (!authUser) {
          setIsLoading(false);
          setIsError(999);
          return;
        } else {
          console.log(authUser);
          con = param
            ? `?userId=${authUser[0].id}${param}`
            : `?userId=${authUser[0].id}`;
        }
      }
      console.log(type, con);
      if (type === "user" || con) {
        await selectDatas(type, con)
          .then((res) => {
            console.log(res);
            setData([...res]);
            setIsError(false);
          })
          .catch((err) => {
            console.log(err.response?.status);
            setIsError(err.response?.status);
          });
        setIsLoading(false);
      }
    };
    select();
  }, [condition, authUser]);

  return [{ data, isLoading, isError }, setCondition];
};

export default useSelectDatas;
