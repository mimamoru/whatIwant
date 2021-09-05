import { useState, useEffect } from "react";
import { postData, getCurrentDate, selectDatas } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";
import { useReroadItems } from "../../context/UserItemsContext";
import { useReroadCompares } from "../../context/UserComparesContext";

export const usePostData = () => {
  const authUser = useAuthUser();

  const [id, setId] = useState(null);
  const [condition, setCondition] = useState({ type: null, data: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  console.log(authUser);
  useEffect(() => {
    const { type, data } = condition;

    if (!type || !data) return;
    if ((type === "user" && authUser) || (type !== "user" && !authUser)) {
      return;
    }
    let unmounted = false;
    const post = async () => {
      if (!unmounted) {
        setIsError(false);
        setIsLoading(true);
        const param = type === "user" ? "" : `?userId=${authUser[0].id}`;
        await selectDatas(type, param)
          .then((res) => {
            console.log("res", res, type);
            const response = res;
            if (type === "user") {
              const currentNum =
                response === []
                  ? 0
                  : +response[response.length - 1].id.split("U")[1];
              data.id = "U" + ("00" + (+currentNum + 1)).slice(-3);
            } else {
              const currentNum =
                response.length === 0
                  ? 0
                  : +response[response.length - 1].id.split("U")[0].slice(-3);
              console.log("currentNum", currentNum, +currentNum + 1);
              data.id =
                (type === "item" ? "IT" : "CP") +
                ("00" + (+currentNum + 1)).slice(-3) +
                authUser[0].id;
            }
          })
          .catch((err) => setIsError(err.response?.status));
        console.log("id", data.id);
        if (!data.id) {
          setIsLoading(false);
          setIsError(true);
          return;
        }
        console.log(data);
        if (data.record !== undefined) {
          data.record.createDate = data.record.recordDate = getCurrentDate();
        }

        if (type === "item" || type === "compare") data.userId = authUser[0].id;
        console.log(data);
        await postData(type, data)
          .then((res) => {
            console.log(res);
            setId(res);

            setIsError(false);
          })
          .catch((err) => {
            console.log(err);
            setIsError(err.response?.status);
          });

        setIsLoading(false);
      }
    };
    post();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
      setIsLoading(false);
    };
  }, [condition, authUser]);

  return [{ id, isLoading, isError }, setCondition];
};

export default usePostData;
