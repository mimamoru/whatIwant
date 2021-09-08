import { useState, useEffect } from "react";
import { usePutData } from "./index";
import { postArrData, deleteArrData } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";
import { useReroadCompares } from "../../context/UserComparesContext";

export const usePutDataEx = () => {
  const authUser = useAuthUser();
  const { compareDispatch } = useReroadCompares();

  //商品更新hook
  const [{ id: itId, isError: itPErr }, setItData] = usePutData();

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
    if (!condition || !itId) return;
    const postCompareData = condition.postCompareData;
    const deleteCompareData = condition.deleteCompareData;
    if (!postCompareData || !deleteCompareData) return;
    let unmounted = false;
    let resultArr = [];
    const put = async () => {
      if (!unmounted) {
        await postArrData(authUser[0].id, postCompareData, itId)
          .then((res) => {
            compareDispatch({
              type: "add",
              data: res,
            });
            resultArr.push(true);
          })
          .catch(() => {
            resultArr.push(false);
          });

        await deleteArrData(deleteCompareData)
          .then((res) => {
            resultArr.push(true);
            compareDispatch({
              type: "delete",
              data: res,
            });
          })
          .catch(() => {
            resultArr.push(false);
          });
        if (resultArr.every((e) => e === true)) {
          setResult(true);
        } else {
          setResult("error");
        }
      }
    };
    put();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [itId, condition, authUser, compareDispatch]);

  return [{ result, itPErr }, setCondition];
};

export default usePutDataEx;
