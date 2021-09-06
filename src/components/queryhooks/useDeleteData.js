import { useState, useEffect } from "react";
import { deleteData, selectDatas } from "../modules/myapi";

export const useDeleteData = () => {
  const [condition, setCondition] = useState({
    type: null,
    id: null,
    param: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [result, setResult] = useState(false);

  useEffect(() => {
    const { type, id, param } = condition;

    let unmounted = false;

    const func = async () => {
      if (!unmounted) {
        setIsError(false);
        setIsLoading(true);
        let getId;
        if (type && !id) {
          await selectDatas(type, param)
            .then((res) => {
              getId = res.id;
            })
            .catch((err) => {
              setIsError(true);
              setIsError(err);
            });
        }
        let paramId = id ? id : getId;
        if (type && paramId) {
          await deleteData(type, paramId)
            .then((res) => {
              setResult(true);
              setIsError(false);
            })
            .catch((err) => {
              setIsError(true);
              setIsError(err);
            });
        }
      }
      setIsLoading(false);
    };
    func();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
      setIsLoading(false);
    };
  }, [condition]);
  return [{ result, isLoading, isError }, setCondition];
};

export default useDeleteData;
