import { useState, useEffect } from "react";
import { selectDatas } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const useSelectDatas = () => {
  const authUser = useAuthUser();
  const [data, setData] = useState(null);
  const [condition, setCondition] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const { type, param } = condition;
    let con;

    if (!type || data) return;
    setIsError(false);
    setIsLoading(true);
    if (type === "user") {
      con = param;
    } else {
      if (!authUser) {
        setIsLoading(false);
        setIsError(true);
        return;
      } else {
        con = param
          ? `?userId=${authUser[0].id}${param}`
          : `?userId=${authUser[0].id}`;
      }
    }
    let unmounted = false;
    const select = async () => {
      if (!unmounted && con !== undefined) {
        await selectDatas(type, con)
          .then((res) => {
            setData(res);
            setIsError(false);
          })
          .catch((err) => {
            setIsError(true);
            setIsError(err);
          });
      }
      setIsLoading(false);
    };
    select();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
      setIsLoading(false);
    };
  }, [condition, data, authUser]);

  return [{ data, isLoading, isError }, setCondition];
};

export default useSelectDatas;
