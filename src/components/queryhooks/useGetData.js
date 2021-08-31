import { useState, useEffect } from "react";
import { getData } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const useGetData = () => {
  const authUser = useAuthUser();
  const [data, setData] = useState({});
  const [condition, setCondition] = useState({ type: "", id: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const { type, id } = condition;
    if (!type) return;
    setIsError(false);
    setIsLoading(true);
    if (authUser.id.split("U")[1] !== id.split("U")[1]) {
      setIsError(999);
      setIsLoading(false);
      return;
    }
    const get = async () => {
      await getData(type, id)
        .then((res) => {
          console.log(res);
          setData([...res]);
          setIsError(false);
        })
        .catch((err) => setIsError(err.response.status));
      setIsLoading(false);
    };
    get();
  }, [condition, authUser]);

  return [{ data, isLoading, isError }, setCondition];
};

export default useGetData;
