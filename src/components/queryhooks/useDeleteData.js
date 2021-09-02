import { useState, useEffect } from "react";
import { deleteData, selectDatas } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";
import { useUserItems } from "../../context/useReroadItemsContext";
import { useUserCompares } from "../../context/useReroadComparesContext";

export const useDeleteData = () => {
  const authUser = useAuthUser();
  const reroadItem = useUserItems();
  const reroadCompare = useUserCompares();

  const [condition, setCondition] = useState({ type: "", param: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const { type, id, param } = condition;
    if (!type) return;
    setIsError(false);
    setIsLoading(true);
    let paramId = id;
    const del = async () => {
      if (!paramId) {
        await selectDatas(type, param)
          .then((res) => {
            paramId = res.id;
          })
          .catch((err) => setIsError(err.response.status));
      }
      console.log(paramId);
      if (paramId) {
        await deleteData(type, paramId)
          .then(() => {
            setIsError(false);
            if (type === "item") reroadItem();
            if (type === "compare") reroadCompare();
          })
          .catch((err) => setIsError(err.response.status));
        setIsLoading(false);
      }
    };
    del();
  }, [condition, authUser, reroadItem, reroadCompare]);

  return [{ isLoading, isError }, setCondition];
};

export default useDeleteData;
