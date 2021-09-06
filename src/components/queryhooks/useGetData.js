import { useState, useEffect } from "react";
import { getData } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const useGetData = () => {
  const authUser = useAuthUser();
  const [data, setData] = useState(null);
  const [condition, setCondition] = useState({ type: null, id: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const { type, id } = condition;
    if (!type || !id || !authUser) return;
    let unmounted = false;

    const get = async () => {
      if (!unmounted) {
        if (authUser[0].id.split("U")[1] !== id.split("U")[1]) {
          setIsError(true);
          setIsLoading(false);
          return;
        }
        await getData(type, id)
          .then((res) => {
            setData(res);
            setIsError(false);
          })
          .catch((err) => {
            setIsError(err);
          });
        setIsLoading(false);
      }
    };
    get();
    return () => {
      setIsLoading(false);
      unmounted = true;
    };
  }, [condition, authUser]);

  return [{ data, isLoading, isError }, setCondition];
};

export default useGetData;
