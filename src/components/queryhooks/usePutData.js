import { useState, useEffect } from "react";
import { putData, getCurrentDate, getData } from "../modules/myapi";
import { useUserItems } from "../../context/useReroadItemsContext";
import { useUserCompares } from "../../context/useReroadComparesContext";

export const usePutData = () => {
  const reroadItem = useUserItems();
  const reroadCompare = useUserCompares();

  const [condition, setCondition] = useState({
    type: "",
    data: {},
    decide: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const { type, data, decide } = condition;
    if (!type) return;
    const put = async () => {
      setIsError(false);
      setIsLoading(true);
      const id = data.id;
      let currentData;
      await getData(type, id)
        .then((res) => {
          currentData = res;
        })
        .catch((err) => setIsError(err.response.status));
      if (!currentData) {
        setIsError("notFound");
        setIsLoading(false);
        return;
      } else if (currentData.record?.recordDate !== data.record?.recordDate) {
        setIsError("changed");
        setIsLoading(false);
        return;
      } else {
        const currentTime = getCurrentDate();
        data.record.recordDate = currentTime;
        if (decide) {
          data.record.decideDate = currentTime;
        }
        await putData(type, data.id, data)
          .then(() => {
            if (type === "item") reroadItem();
            if (type === "compare") reroadCompare();
            setIsError(false);
          })
          .catch((err) => setIsError(err.response.status));
      }
      setIsLoading(false);
    };
    put();
  }, [condition, reroadItem, reroadCompare]);

  return [{ isLoading, isError }, setCondition];
};

export default usePutData;
