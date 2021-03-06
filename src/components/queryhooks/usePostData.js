import { useState, useEffect } from "react";
import { postData, getCurrentDate, selectDatas } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";
import { useReroadUsers } from "../../context/AuthUserContext";
import { useReroadItems } from "../../context/UserItemsContext";

export const usePostData = () => {
  const authUser = useAuthUser();
  const { itemDispatch } = useReroadItems();
  const { userDispatch } = useReroadUsers();

  const [id, setId] = useState(null);
  const [condition, setCondition] = useState({ type: null, data: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
              data.id =
                (type === "item" ? "IT" : "CP") +
                ("00" + (+currentNum + 1)).slice(-3) +
                authUser[0].id;
            }
          })
          .catch((err) => {
            setIsError(true);
            setIsError(err);
          });
        if (!data.id) {
          setIsLoading(false);
          setIsError(true);
          return;
        }
        if (data.record !== undefined) {
          data.record.createDate = data.record.recordDate = getCurrentDate();
        }

        if (type === "item" || type === "compare") data.userId = authUser[0].id;
        await postData(type, data)
          .then((res) => {
            setId(res.id);
            if (type === "item") {
              itemDispatch({
                type: "add",
                data: res,
              });
            } else if (type === "user") {
              userDispatch({
                ...{
                  type: "add",
                  data: res,
                },
              });
            }
            setIsError(false);
          })

          .catch((err) => {
            setIsError(err);
          });
        setIsLoading(false);
      }
    };
    post();
    // clean up?????????Unmount???????????????
    return () => {
      unmounted = true;
    };
  }, [condition, authUser, itemDispatch, userDispatch]);

  return [{ id, isLoading, isError }, setCondition];
};

export default usePostData;
