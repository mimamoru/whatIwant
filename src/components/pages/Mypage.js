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

  const statistics1 = pcsItems
    .map((e) => ({
      decideDate: moment(
        new Date(e.record.decideDate.split(" ")[0]).getTime()
      ).format("YYYY-MM-DD"),
      amount: e.record.qty * e.record.cost,
    }))
    .reduce((res, cur) => {
      const elm = res.find((val) => val.decideDate === cur.decideDate);
      if (elm) {
        elm.amount += cur.amount;
      } else {
        res.push({
          decideDate: cur.decideDate,
          amount: cur.amount,
        });
      }
      return res;
    }, []);
  statistics1.sort((a, b) => new Date(a.decideDate) - new Date(b.decideDate));

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

  //??????????????????hook
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

  return (
    <GenericTemplate title="MyPage">
      <hr />
      <div id="wrapper" className={classes.root}>
        <Grid container justifyContent="center">
          <Grid item xs={3}>
            <Paper className={classes.paper}>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" gutterBottom>
                  ???ID
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.id}
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ????????????
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.name}??????
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ?????????????????????
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.beginDate}
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ?????????????????????
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.regItems}???
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ??????????????????
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.pcsItems}???
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ???????????????????????????
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.cancelItems}???
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                  ?????????????????????
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                  &nbsp;&nbsp;{data.pcsAmount}???
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={7}>
            <Paper className={classes.paper}>
              <Grid container className={classes.container}>
                <Grid item xs={12}>
                  <BarChart
                    width={500}
                    height={300}
                    data={staticsData.statistics1}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis // X???
                      name="?????????"
                      dataKey="decideDate" // X???????????????????????????????????????
                      tickFormatter={(props) =>
                        moment(props).format("YYYY-MM-DD")
                      } // X?????? YYYY/MM/DD ????????????????????????
                    />
                    <YAxis // Y???
                      name="????????????"
                      unit="???" // Y????????????
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      name="?????????/????????????"
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
                    <XAxis dataKey="budget" name="??????(??????)" unit="???" />
                    <YAxis dataKey="cost" name="????????????" unit="???" />
                    <ZAxis
                      dataKey="level"
                      range={[0, 100]}
                      name="?????????"
                      unit="%"
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <br />
                    <Scatter
                      name="??????(??????)/????????????"
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
