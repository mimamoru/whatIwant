import { React, useState, useEffect } from "react";
import { useUserItems } from "../../context/UserItemsContext";
import { useUserCompares } from "../../context/UserComparesContext";
import { useAuthUser } from "../../context/AuthUserContext";
import GenericTemplate from "../molecules/GenericTemplate";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Legend,
  YAxis,
  ZAxis,
  ScatterChart,
  ResponsiveContainer,
  Tooltip,
  Scatter,
} from "recharts";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "left",
    height: 700,
    color: theme.palette.text.secondary,
  },
  container: {
    padding: theme.spacing(1),
    height: 350,
  },
}));

const calcItemData = (items) => {
  const recordedItems = items.filter((e) => e.record?.decideDate !== null);
  const pcsItems = recordedItems.filter((e) => e.record?.qty !== null);
  const pcsAmount = pcsItems.reduce(
    (p, x) => p + x.record.qty * x.record.cost,
    0
  );

  const statistics1 = pcsItems.map((e) => ({
    decideDate: moment(
      new Date(e.record.decideDate.split(" ")[0]).getTime()
    ).format("YYYY-MM-DD"),
    amount: e.record.qty * e.record.cost,
  }));

  statistics1.sort((a, b) => a.decideDate - b.decideDate);

  const statistics2 = pcsItems.map((e) => ({
    budget: e.budget,
    cost: e.record.cost,
    level: e.level,
  }));
  statistics2.sort((a, b) => a.budget - b.budget);

  return {
    pcsItems: pcsItems.length,
    cancelItems: recordedItems.length - pcsItems.length,
    pcsAmount: pcsAmount,
    statistics1: statistics1,
    statistics2: statistics2,
  };
};
const Mypage = () => {
  const classes = useStyles();

  //比較情報取得hook
  const { compares } = useUserCompares();

  const { items } = useUserItems();
  const authUser = useAuthUser();
  const [data, setData] = useState([
    {
      id: "",
      name: "",
      beginDate: "",
      regItems: "",
      pcsItems: "",
      cancelItems: "",
      pcsAmount: "",
      level: "",
    },
  ]);
  const [staticsData, setStaticsData] = useState({
    decideDate: "",
    amount: "",
    budget: "",
    cost: "",
  });

  useEffect(() => {
    if (!items || !compares || !authUser) return;
    const { pcsItems, cancelItems, pcsAmount, statistics1, statistics2 } =
      calcItemData(items);
    setData({
      id: authUser[0].id,
      name: authUser[0].name,
      beginDate: authUser[0].record?.createDate.split(" ")[0],
      regItems: items?.length,
      pcsItems: pcsItems,
      cancelItems: cancelItems,
      pcsAmount: pcsAmount,
    });
    setStaticsData({ statistics1: statistics1, statistics2: statistics2 });
  }, [items, compares, authUser]);
  console.log(staticsData);
  return (
    <GenericTemplate title="MyPage">
      <hr />
      <div id="wrapper" className={classes.root}>
        <Grid container justify="center">
          <Grid item xs={3}>
            <Paper className={classes.paper}>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" gutterBottom>
                  ▽ID
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.id}
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ▽お名前
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.name}さん
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ▽ご利用開始日
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.beginDate}
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ▽総登録商品数
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.regItems}品
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ▽購入商品数
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.pcsItems}品
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ▽キャンセル商品数
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.cancelItems}品
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ▽購入金額合計
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.pcsAmount}円
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <Paper className={classes.paper}>
              <Grid container className={classes.container}>
                <Grid item xs={12}>
                  <BarChart width={500} height={300} data={staticsData.statistics1}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis // X軸
                      name="購入日"
                      dataKey="decideDate" // X軸の基準となるデータ項目名
                      tickFormatter={(props) =>
                        moment(props).format("YYYY-MM-DD")
                      } // X軸を YYYY/MM/DD 形式で表示します
                    />
                    <YAxis // Y軸
                      name="購入金額"
                      unit="円" // Y軸の単位
                    />

                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      name="購入日/購入金額"
                      fill="#8884d8"
                    />
                  </BarChart>
                </Grid>
                <br />
              </Grid>
              <Grid container className={classes.container}>
                <Grid item xs={6}>
                  <ScatterChart
                    width={500}
                    height={250}
                    margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="budget" name="予算(単価)" unit="円" />
                    <YAxis dataKey="cost" name="購入単価" unit="円" />
                    <ZAxis
                      dataKey="level"
                      range={[0, 100]}
                      name="必要性"
                      unit="%"
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <br />
                    <Scatter
                      name="予算(単価)/購入単価"
                      data={staticsData.statistics2}
                      fill="#82ca9d"
                    />
                  </ScatterChart>
                  <br />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </GenericTemplate>
  );
};

export default Mypage;
