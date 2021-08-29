import { useState, useEffect } from "react";
import { postData, getCurrentDate, selectDatas } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const usePostData = () => {
  const authUser = useAuthUser();
  const [condition, setCondition] = useState({ type: "", data: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const post = async () => {
      setIsError(false);
      setIsLoading(true);
      const { type, data } = condition;

      await selectDatas(type)
        .then((res) => {
          const response = res.data;
          const currentNum =
            response === []
              ? "000"
              : response[response.length - 1].id.split("U")[0].slice(-3);
          if (type === "user") {
            data.id = "U" + (+currentNum + 1);
          } else {
            data.id =
              (type === "item" ? "IT" : "CP") + (+currentNum + 1) + authUser.id;
          }
        })
        .catch((err) => setIsError(err.response?.status));
      if (!data.id) {
        setIsLoading(false);
        return;
      }
      if (type !== "compare") {
        data.record = {};
        data.record.createDate = getCurrentDate;
        data.record.recordDate = getCurrentDate;
      }
      console.log(type);
      if (type === ("item" || "compare")) data.userId = authUser.id;
      await postData(type, data).catch((err) => {
        console.log(err.response);
        setIsError(err.response?.status);
      });
      setIsLoading(false);
    };
    post();
  }, [condition, authUser]);

  return [{ isLoading, isError }, setCondition];
};

export default usePostData;
