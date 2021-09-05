import { useState, useEffect } from "react";
import { usePostData, useDeleteData, usePutData } from "./index";
import { useReroadItems } from "../../context/UserItemsContext";
import { useReroadCompares } from "../../context/UserComparesContext";
import { useForm } from "react-hook-form";

export const usePutDataEx = () => {
  const reroadItem = useReroadItems();
  const reroadCompare = useReroadCompares();
  //商品更新hook
  const [{ id: itId, isLoading: itPLoaging, isError: itPErr }, setItData] =
    usePutData();
  //比較情報登録hook
  const [{ id: cpId, isLoading: cpPLoaging, isError: cpPErr }, setCpPData] =
    usePostData();
  //比較情報削除hook
  const [
    { result: cpResult, isLoading: cpDLoaging, isError: cpDErr },
    setCpDData,
  ] = useDeleteData();

  const [result, setResult] = useState(false);

  const [condition, setCondition] = useState(null);

  // const { itemData, data } = condition;
  useEffect(() => {
    if (condition && !itId) {
      const putItemData = condition.putItemData;
      console.log(putItemData);
      let unmounted = false;
      const put = () => {
        if (!unmounted) {
          setItData({ type: "item", data: putItemData });
        }
      };
      put();
      // clean up関数（Unmount時の処理）
      return () => {
        unmounted = true;
      };
    }
  }, [condition, setItData, itId]);

  useEffect(() => {
    console.log(itId, condition);
    if (!condition || !itId) return;
      const postCompareData = condition.postCompareData;
      if (!postCompareData || postCompareData.length === 0) return;
      let unmounted = false;
      const post = () => {
        if (!unmounted) {
          for (let e of postCompareData) {
            const putData = {
              type: "compare",
              data: {
                id: null,
                compare0: e[0],
                compare1: e[1],
              },
            };
            setCpPData({ ...putData });
          }
        }
      };
      post();
      // clean up関数（Unmount時の処理）
      return () => {
        unmounted = true;
      };
  }, [itId, condition, setCpPData]);

  useEffect(() => {
    if (itId && condition) {
      const deleteCompareData = condition.deleteCompareData;
      console.log("delete", deleteCompareData);
      if (!deleteCompareData || deleteCompareData.length === 0) return;
      let unmounted = false;
      const del = () => {
        if (!unmounted) {
          for (let e of deleteCompareData) {
            const deleteData = {
              type: "compare",
              param: `?compare0=${e[0]}&compare1=${e[1]}`,
            };
            setCpDData({ ...deleteData });
          }
        }
      };
      del();
      // clean up関数（Unmount時の処理）
      return () => {
        unmounted = true;
      };
    }
  }, [itId, condition, setCpDData]);

  useEffect(() => {
    if (!condition || !itId) return;
    let unmounted = false;
    const bool =
      !unmounted &&
      (cpId || condition.postCompareData.length === 0) &&
      (cpResult || condition.deleteCompareData.length === 0);
    const func = () => {
      if (bool) {
        setResult(true);
      }
    };
    func();
    // clean up関数（Unmount時の処理）
    return () => {
      if (bool) {
        reroadItem();
        reroadCompare();
      }
      unmounted = true;
    };
  }, [itId, cpId, result, cpResult, condition, reroadCompare, reroadItem]);

  return [{ result, itPErr, cpPErr, cpDErr }, setCondition];
};

export default usePutDataEx;
