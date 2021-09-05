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
  console.log(`${url}/${id}`);
  //const path = id === "" ? url : `${url}/${id}`;
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
  //`${url}?_page=${page}&_limit=10`;
  //?title=json-server&author=typicode
  const path = `${url}${param}`;
  console.log("@@@@@@", path);
  let response;
  await axios
    .get(path)
    .then((res) => {
      response = res.data;
      // return res.data;
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
      response = res.data?.id;
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
  console.log("KOaaaaaaOKOK", dataArr, length);
  for (let i = 0; i < length; i++) {
    const target = [dataArr[i], itId].sort();
    const targetObj = {
      id: null,
      compare0: target[0],
      compare1: target[1],
      userId: uid,
    };
    targetObj.id = "CP" + ("00" + (+nexttNum + i)).slice(-3) + uid;
    console.log("KOKOKOKOKOKOK", targetObj);
    await postData("compare", targetObj).then((res) => {
      console.log(res);
      response.push(res);
    });
  }
  console.log(response, dataArr);
  return response.length === length;
};

//ローカルサーバーの値を更新する
export const putData = async (type = "", id = "", data = {}) => {
  const path = getUrl(type);
  let response;
  await axios
    .put(`${path}/${id}`, data)
    .then((res) => {
      response = res.data?.id;
    })
    .catch((err) => {
      throw new Error(err.response?.status);
    });
  return response;
};

//ローカルサーバーの値を削除する
export const deleteData = async (type = "", id = "") => {
  const path = getUrl(type);
  console.log(path);
  let response;
  await axios
    .delete(`${path}/${id}`)
    .then((res) => {
      response = true;
    })
    .catch((err) => {
      throw new Error(err.response?.status);
    });
  return response;
};

//ローカルサーバーの値を削除する(行列)
export const deleteArrData = async (dataArr = []) => {
  const path = getUrl("compare");
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
    await axios.delete(`${path}/${idArr[i]}`).then((res) => {
      response.push(true);
    });
  }
  console.log("hohohoho",response,"hohohoho",dataArr[0],"hohohoho",dataArr)
  return response.length === length;
};

//整合性チェック
// export const currentVersionCheck = async (type, recordDate) => {
//   let result;
//   await getData(type).then((res) => {
//     result = res;
//   });
//   if (!result) return "";
//   // if (result.length === 0 && length === 0) {
//   //   return "ok";
//   // } else if (result.length !== length) {
//   //   return "changed";
//   // }
//   const maxRecordDate = result.reduce((acc, value) =>
//     acc.recordDate > value.recordDate ? acc.recordDate : value.recordDate
//   );
//   if (maxRecordDate > recordDate) return "changed";
//   return "ok";
// };

//差分
// export const findDiff = (olds, nexts) => ({
//   adds: nexts.filter((e) => !olds.includes(e)),
//   subs: olds.filter((e) => !nexts.includes(e)),
// });

//現在日時取得
let now = new Date();
export const getCurrentDate = (day=now) => {
  const Year = day.getFullYear();
  const Month = day.getMonth() + 1;
  const Date = day.getDate();
  const Hour = day.getHours();
  const Min = day.getMinutes();
  const Sec = day.getSeconds();
  return Year + "-" + ("0"+Month).slice(-2) + "-" + ("0"+Date).slice(-2) + " " + Hour + ":" + Min + ":" + Sec;
};
