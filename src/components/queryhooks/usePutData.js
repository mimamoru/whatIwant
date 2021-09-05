import { useState, useEffect } from "react";
import { putData, getCurrentDate, getData } from "../modules/myapi";
import { useReroadItems } from "../../context/UserItemsContext";
import { useReroadCompares } from "../../context/UserComparesContext";
import { useAuthUser } from "../../context/AuthUserContext";

export const usePutData = () => {
  const authUser = useAuthUser();
  const reroadItem = useReroadItems();
  const reroadCompare = useReroadCompares();
  const [id, setId] = useState(null);

  const [condition, setCondition] = useState({
    type: null,
    data: null,
    decide: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const { type, data, decide } = condition;
    if (!type || id) return;
    let unmounted = false;
    const put = async () => {
      if (!unmounted) {
        setIsError(false);
        setIsLoading(true);
        const paramIid = data.id;
        let currentData;
        await getData(type, paramIid)
          .then((res) => {
            currentData = res;
          })
          .catch((err) => {
            setIsError(true);
            setIsError(err);
          });
        if (!currentData) {
          setIsError("notFound");
          setIsLoading(false);
          return;
        } else if (data.record !== undefined) {
          if (currentData.record?.recordDate !== data.record?.recordDate) {
            setIsError("changed");
            setIsLoading(false);
            return;
          }
          const currentTime = getCurrentDate();
          data.record.recordDate = currentTime;
          if (decide) {
            data.record.decideDate = currentTime;
          }
          if (type === "item" || type === "compare")
            data.userId = authUser[0].id;
          await putData(type, data.id, data)
            .then((res) => {
              setId(res);
              setIsError(false);
            })
            .catch((err) => {
              setIsError(true);
              setIsError(err);
            });
        }
        setIsLoading(false);
      }
    };
    put();
    // clean up関数（Unmount時の処理）
    return () => {
      //setIsLoading(false);
      unmounted = true;
      if (decide) {
        if (type === "item") reroadItem();
        if (type === "compare") reroadCompare();
      }
    };
  }, [condition, reroadItem, id, reroadCompare, authUser]);

  return [{ id, isLoading, isError }, setCondition];
};

export default usePutData;
