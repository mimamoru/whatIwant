import { useState, useEffect } from "react";
import { deleteData, selectDatas } from "../modules/myapi";

export const useDeleteData = () => {
  // const reroadItem = useReroadItems();
  // const reroadCompare = useReroadCompares();

  const [condition, setCondition] = useState({
    type: null,
    id: null,
    param: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [result, setResult] = useState(false);
  const [getId, setGetId] = useState(null);

  useEffect(() => {
    const { type, id, param } = condition;
    if (type&& !getId&&! id){ 
    let unmounted = false;

    const get = async () => {
      if (!unmounted) {
        setIsError(false);
        setIsLoading(true);

        await selectDatas(type, param)
          .then((res) => {
            setGetId(res.id);
          })
          .catch((err) => setIsError(err.response.status));
      }
    };
    get();
   } }, [condition,getId]);

  useEffect(() => {
    const { type, id } = condition;

    let paramId = id ? id : getId;
    if (!type || !paramId) return;
    let unmounted = false;
    const del = async () => {
      if (!unmounted) {
        setIsError(false);
        setIsLoading(true);

        await deleteData(type, paramId)
          .then((res) => {
            console.log(res);
            setResult(res);
            setIsError(false);
          })
          .catch((err) => setIsError(err.response.status));
        setIsLoading(false);
      }
    };
    del();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
      setIsLoading(false);

    };
  }, [getId, condition]);

  return [{ result, isLoading, isError }, setCondition];
};

export default useDeleteData;
