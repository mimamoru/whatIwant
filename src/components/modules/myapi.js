import axios from "axios";
const userPath = "http://localhost:3001/users";
const itemPath = "http://localhost:3001/items";
const comparePath = "http://localhost:3001/compares";

//axios.defaults.withCredentials = true;

//url取得
export const getUrl = (type) => {
  switch (type) {
    case "user":
      return userPath;
    case "item":
      return itemPath;
    case "compare":
      return comparePath;
    default:
      return "";
  }
};

//ローカルサーバーからid指定で値を取得する
export const getData = async (type, id = "") => {
  const url = getUrl(type);
  let response;
  await axios
    .get(`${url}/${id}`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      throw new Error(err.response?.status);
    });
  return response;
};

//ローカルサーバーから条件指定で値を取得する
export const selectDatas = async (type, param = "") => {
  const url = getUrl(type);
  const path = `${url}${param}`;
  let response;
  await axios
    .get(path)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      throw new Error(err.response?.status);
    });
  return response;
};

//ローカルサーバーに値を登録する
export const postData = async (type = "", data = {}) => {
  const path = getUrl(type);
  let response;
  await axios
    .post(path, data)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      throw new Error(err.response?.status);
    });
  return response;
};

//ローカルサーバーに値を登録する(行列)
export const postArrData = async (uid, dataArr = [], itId = "") => {
  const length = dataArr.length;
  let response = [];
  const con = `?userId=${uid}`;
  let nexttNum;
  await selectDatas("compare", con).then((res) => {
    nexttNum =
      res.length === 0
        ? 1
        : +res[res.length - 1].id.split("U")[0].slice(-3) + 1;
  });
  for (let i = 0; i < length; i++) {
    const target = [dataArr[i], itId].sort();
    const targetObj = {
      id: null,
      compare0: target[0],
      compare1: target[1],
      userId: uid,
    };
    targetObj.id = "CP" + ("00" + (+nexttNum + i)).slice(-3) + uid;
    await postData("compare", targetObj).then((res) => {
      response.push(res);
    });
  }
  return response;
};

//ローカルサーバーの値を更新する
export const putData = async (type = "", id = "", data = {}) => {
  const path = getUrl(type);
  let response;
  await axios
    .put(`${path}/${id}`, data)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      throw new Error(err.response?.status);
    });
  return response;
};

//ローカルサーバーの値を削除する
export const deleteData = async (type = "", id = "") => {
  const path = getUrl(type);
  let response;
  await axios
    .delete(`${path}/${id}`)
    .then(() => {
      response = true;
    })
    .catch((err) => {
      throw new Error(err.response?.status);
    });
  return response;
};

//ローカルサーバーの値を削除する(行列)
export const deleteArrData = async (dataArr = []) => {
  const length = dataArr.length;
  let response = [];
  let idArr = [];
  for (let i = 0; i < length; i++) {
    const target = dataArr[i];
    const con = `?compare0=${target[0]}&compare1=${target[1]}`;
    await selectDatas("compare", con).then((res) => {
      idArr.push(res[0].id);
    });
  }
  for (let i = 0; i < idArr.length; i++) {
    await deleteData("compare", idArr[i]).then(() => {
      response.push(true);
    });
  }
  return idArr;
};

//現在日時取得
let now = new Date();
export const getCurrentDate = (day = now) => {
  const Year = day.getFullYear();
  const Month = day.getMonth() + 1;
  const Date = day.getDate();
  const Hour = day.getHours();
  const Min = day.getMinutes();
  const Sec = day.getSeconds();
  return (
    Year +
    "-" +
    ("0" + Month).slice(-2) +
    "-" +
    ("0" + Date).slice(-2) +
    " " +
    Hour +
    ":" +
    Min +
    ":" +
    Sec
  );
};
