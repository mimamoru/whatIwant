import { useState, useEffect } from "react";
import { deleteData, selectDatas } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const useDeleteData = () => {
  const authUser = useAuthUser();
  const [condition, setCondition] = useState({ type: "", param: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const del = async () => {
      const { type, id, param } = condition;
      if(!type) return;
      setIsError(false);
      setIsLoading(true);
      let paramId = id;
      if (!paramId) {
        await selectDatas(type, param)
          .then((res) => {
            paramId = res.id;
          })
          .catch((err) => setIsError(err.response.status));
      }
      if (authUser.id.split("U")[1] !== paramId.split("U")[1]) {
        setIsError(999);
        setIsLoading(false);
        return;
      }
      await deleteData(type, paramId).then(
        setIsError(false)
      ).catch((err) =>
        setIsError(err.response.status)
      );
      setIsLoading(false);
    };
    del();
  }, [condition, authUser]);

  return [{ isLoading, isError }, setCondition];
};

export default useDeleteData;
