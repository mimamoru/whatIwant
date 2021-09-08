import { useState, useEffect } from "react";
import { usePostData } from "../queryhooks/index";

import { useReroadCompares } from "../../context/UserComparesContext";
import { postArrData } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const usePostDataEx = () => {
  const authUser = useAuthUser();
  const { compareDispatch } = useReroadCompares();

  //商品情報登録hook
  const [{ id: itId, isError: itPErr }, setitPData] = usePostData();

  const [result, setResult] = useState(false);

  const [condition, setCondition] = useState(null);

  useEffect(() => {
    if (!condition || itId) return;
    const itemData = condition.itemData;
    let unmounted = false;
    const post = () => {
      if (!unmounted) {
        setitPData({
          type: "item",
          data: itemData,
        });
      }
    };
    post();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [condition, setitPData, itId]);

  useEffect(() => {
    if (!condition || !itId) return;
    const compareData = condition.compareData;
    if (!compareData) return;
    let unmounted = false;
    const post = async () => {
      if (!unmounted) {
        await postArrData(authUser[0].id, compareData, itId)
          .then((res) => {
            setResult(true);
            compareDispatch({
              type: "add",
              data: res,
            });
          })
          .catch(() => {
            setResult("error");
          });
      }
    };
    post();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [authUser, condition, itId, compareDispatch]);
  return [{ result, itId, itPErr }, setCondition];
};

export default usePostDataEx;
