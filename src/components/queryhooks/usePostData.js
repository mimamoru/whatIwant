import { useState, useEffect } from "react";
import { postData, getCurrentDate, selectDatas } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const usePostData = () => {
  const authUser = useAuthUser();
  const [id, setId] = useState(null);
  const [condition, setCondition] = useState({ type: "", data: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  console.log(authUser);
  useEffect(() => {
    const { type, data } = condition;
    console.log(data);
    if (!type || !data) return;
    if ((type === "user" && authUser) || (type !== "user" && !authUser)) {
      return;
    }
    let unmounted = false;
    const post = async () => {
      setIsError(false);
      setIsLoading(true);
      if (!unmounted) {
        await selectDatas(type)
          .then((res) => {
            const response = res;
            if (type === "user") {
              const currentNum =
                response === []
                  ? 0
                  : +response[response.length - 1].id.split("U")[1];
              data.id = "U" + ("00" + (+currentNum + 1)).slice(-3);
            } else {
              const currentNum =
                response === []
                  ? 0
                  : +response[response.length - 1].id.split("U")[0];
              data.id =
                (type === "item" ? "IT" : "CP") +
                ("00" + (+currentNum + 1)).slice(-3) +
                authUser.id;
            }
          })
          .catch((err) => setIsError(err.response?.status));
        if (!data.id) {
          setIsLoading(false);
          setIsError(true);
          return;
        }
        if (type !== "compare") {
          data.record.createDate = data.record.recordDate = getCurrentDate();
        }

        if (type === ("item" || "compare")) data.userId = authUser.id;
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
      }
      setIsLoading(false);
    };
    post();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [condition, authUser]);

  return [{ id, isLoading, isError }, setCondition];
};

export default usePostData;
