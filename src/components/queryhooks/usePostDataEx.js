import { useState, useEffect } from "react";
import { usePostData } from "../queryhooks/index";
import { useReroadItems } from "../../context/UserItemsContext";
import { useReroadCompares } from "../../context/UserComparesContext";
import { postArrData } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";

export const usePostDataEx = () => {
  const authUser = useAuthUser();
  const reroadItem = useReroadItems();
  const reroadCompare = useReroadCompares();
  //商品情報登録hook
  const [{ id: itId, isLoading: itPLoaging, isError: itPErr }, setitPData] =
    usePostData();

  const [result, setResult] = useState(false);

  const [condition, setCondition] = useState(null);
  // const { itemData, data } = condition;
  useEffect(() => {
    if (!condition || itId) return;
    const itemData = condition.itemData;
    console.log(itemData);
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
    console.log(compareData, itId);
    if (!compareData) return;
    let unmounted = false;
    const post = async () => {
      if (!unmounted) {
        await postArrData(authUser[0].id, compareData, itId)
          .then((res) => {
            console.log(res);
            setResult(res);
           
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
      reroadItem();
      reroadCompare();
    };
  }, [authUser, condition, itId, reroadCompare, reroadItem]);
  return [{ result, itId, itPErr }, setCondition];
};

export default usePostDataEx;
