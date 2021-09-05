import { useState, useEffect } from "react";
import { usePostData } from "../queryhooks/index";
import { useReroadItems } from "../../context/UserItemsContext";
import { useReroadCompares } from "../../context/UserComparesContext";

export const usePostDataEx = () => {
  const reroadItem = useReroadItems();
  const reroadCompare = useReroadCompares();
  //商品情報登録hook
  const [{ id: itId, isLoading: itPLoaging, isError: itPErr }, setitPData] =
    usePostData();
  //比較情報登録hook
  const [{ id: cpId, isLoading: cpPLoaging, isError: cpPErr }, setcpPData] =
    usePostData();

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
    if (!compareData || compareData.length === 0) return;
    let unmounted = false;
    const post=() => {
      if (!unmounted) {
        for (let e of compareData) {
          console.log(e);
          const arr = [itId, e].sort();
          const postData = {
            type: "compare",
            data: {
              id: null,
              compare0: arr[0],
              compare1: arr[1],
            },
          };
          setcpPData({ ...postData });
        }
      }
    };
    post();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [condition, cpId, itId, setcpPData]);

  useEffect(() => {
    let unmounted = false;
    if (!condition || !itId) return;
    const func = () => {
      if (!unmounted && (cpId || condition.compareData?.length === 0)) {
        reroadItem();
        reroadCompare();
      }
    };
    func();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [itId, cpId, condition, reroadCompare, reroadItem]);

  return [{ itId, itPErr, cpPErr }, setCondition];
};

export default usePostDataEx;
