import { useState, useEffect } from "react";
import { putData, getCurrentDate, getData } from "../modules/myapi";

export const usePutData = () => {
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
      }
      if (currentData.record?.recordDate !== data.record?.recordDate) {
        setIsError("changed");
        setIsLoading(false);
        return;
      }
      const currentTime = getCurrentDate;
      data.record.recordDate = currentTime;
      if (decide) {
        data.record.decideDate = currentTime;
      }
      await putData(type, data.id, data).catch((err) =>
        setIsError(err.response.status)
      );
      setIsLoading(false);
    };
    put();
  }, [condition]);

  return [{ isLoading, isError }, setCondition];
};

export default usePutData;
