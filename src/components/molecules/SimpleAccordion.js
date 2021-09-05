import {
  useState,
  memo,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import ConfirmDialog from "../atoms/ConfirmDialog";
import CustomizedSnackbars from "../atoms/CustomizedSnackbars";
import { BaseYup } from "../modules/localeJP";
import { blue } from "@material-ui/core/colors";

import CircularIndeterminate from "../atoms/CircularIndeterminate";
import { useUserCompares } from "../../context/UserComparesContext";
import { useUserItems } from "../../context/UserItemsContext";
import { useHistory } from "react-router-dom";
import { useGetData, usePutData, usePutDataEx } from "../queryhooks/index";
import {
  err,
  drop,
  purchase,
  cancel,
  change,
  notFound,
  confirmDelete,
  confirmPurchase,
  confirmCancel,
} from "../modules/messages";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
    display: "inline-block",
    verticalAlign: "middle",
    margin: theme.spacing(0.5),
  },
  accordion: {
    display: "inline-block",
    position: "relative",
    verticalAlign: "middle",
    width: 350,
    height: 300,
  },
  // content:{
  //   width: 400,
  //   display: "block",
  //   textAlign: "center",
  //   verticalAlign: "middle",
  //   position: "relative",
  // },
  details: {
    position: "absolute",
    display: "inline-block",
    width: 350,
    top: 250,
    zIndex: 100,
    backgroundColor: "white",
  },
  // action: {
  //   display: "block",
  //   position: "relative",
  //   width: 400,
  //   height: 70,
  // },
  heading: {
    width: 300,
    // height: 70,
    // display: "block",
    // textAlign: "center",
    verticalAlign: "middle",
    position: "relative",
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  button: {
    zIndex: 10,
    pointerEvents: "visible",
    margin: theme.spacing(0.3),
  },
  avatar: {
    width: "10ch",
    backgroundColor: blue[500],
  },
}));

const selectCompares = (compares, itemId) => {
  if (!compares) return [];
  console.log(compares, itemId);
  const arr = [];
  compares
    .filter((e) => itemId === e.compare0 || itemId === e.compare1)
    .forEach((e) => arr.push(...[e.compare0, e.compare1]));
  return [...new Set(arr.filter((e) => e !== itemId))].sort();
};
//詳細情報エラー表示の削除
const handleChange = (id) => {
  if (id) {
    document.getElementById(id).innerHTML = "";
  } else {
    Array.from(document.getElementsByClassName("error")).forEach(
      (e) => (e.innerHTML = "")
    );
  }
};

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//情報表示用パネル
const SimpleAccordion = memo(({ elm, allCondition }) => {
  const history = useHistory();
  //商品情報取得hook(1件)
  const [{ data: item, isLoading: itLoaging, isError: itErr }, setItId] =
    useGetData();
  //商品更新hook
  const [{ id: itId, isLoading: itPLoaging, isError: itPErr }, setItPData] =
    usePutData();

  //情報更新hook(削除用)
  const [{ result, itPErr: itDErr, cpPErr, cpDErr }, setCondition] =
    usePutDataEx();
  // //比較情報削除hook
  // const [{ isLoading: itDLoaging, isError: itDErr }, setItDId] =
  //   useDeleteData();
  //比較情報取得hook
  const { compares, cpLoaging, cpErr } = useUserCompares();
  console.log(compares);

  const { items, itsLoaging, itsErr } = useUserItems();

  const classes = useStyles();
  //数量(検索結果)の状態
  const inputQtyRef = useRef(null);
  //単価(検索結果)の状態
  const inputCostRef = useRef(null);

  //確認ダイアログメッセージののメッセージの状態管理
  const [confDlg, setConfDlg] = useState("");

  //スナックバーの状態管理
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  //スナックバーを閉じる処理
  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackbar({ ...snackbar, open: false });
    },
    [snackbar]
  );
  //編集アイコン押下
  const handleEdit = useCallback(
    (elm) => {
      const id = elm.id;
      //最新の商品情報を取得する
      setItId({
        type: "item",
        id: id,
      });
    },
    [setItId]
  );
  useEffect(() => {
    if (!item || !items || !compares) return;

    if (itErr) {
      setSnackbar({ open: true, severity: "error", message: err });
      return;
    }
    //const paramItem = item;
    //商品が、削除、購入、キャンセル状態の場合は警告を表示し、処理を中断する
    if (item.record?.decideDate || item.delete === true) {
      setSnackbar({ open: true, severity: "warning", message: change });
      return;
    }
    console.log(item);
    const compareArr = selectCompares(compares, item.id);
    console.log(compareArr, item);
    //比較情報に対応する商品名を取得(セレクトボックス初期値のため
    const option = items
      .filter((e) => compareArr.indexOf(e.id) !== -1)
      .map((e) => ({ value: e.id, label: `${e.id}:${e.name}` }));

    //検索条件と取得した情報をパラメータとして編集画面に遷移する
    history.push("/edit", {
      condition: allCondition,
      itemInfo: item,
      option: option,
    });
  }, [allCondition, history, itErr, item, compares, items]);

  //削除処理
  const handleDelete = useCallback(() => {
    setConfDlg("");
    const id = elm.id;
    const deleteCompareData = selectCompares(compares, id);
  //  const deleteCompareData = compareArr.map((e) => [e, id].sort());
    //商品情報を論理削除し、画面から消去する
    setCondition(elm.id);
    elm.delete = true;
    setCondition({
      putItemData: elm,
      postCompareData: [],
      deleteCompareData: deleteCompareData,
    });
  }, [compares, elm, setCondition]);
  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (elm && !unmounted) {
        if (itDErr) {
          setSnackbar({ open: true, severity: "error", message: err });
          return;
        } else if (result) {
          setSnackbar({ open: true, severity: "success", message: drop });
          await _sleep(2000);
          const dom = document.getElementById(elm.id);
          if (dom) dom.style.display = "none";
        }
      }
    };
    func();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [elm, itDErr, result]);

  // const updateItem = () => {
  //   //商品情報更新
  //   setItPData({ type: "item", data: elm, decide: true });
  // };

  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (elm && !unmounted) {
        if (itPErr) {
          //商品が更新、削除されていた場合は警告を表示し処理を終了する
          const message =
            itPErr === "changed"
              ? change
              : itPErr === "notFound"
              ? notFound
              : err;
          setSnackbar({ open: true, severity: "error", message: message });
        } else if (itId) {
          //商品情報更新後、検索結果で非表示とする
          const message = elm.record?.qty ? purchase : cancel;
          console.log(message);
          setSnackbar({ open: true, severity: "success", message: message });
          console.log(elm);
          await _sleep(2000);
          const dom = document.getElementById(elm.id);
          console.log("!!!!!!!!!D", dom, "elm", elm);
          if (dom) dom.style.display = "none";
        }
      }
    };
    func();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [elm, itId, itPErr]);

  //購入処理
  const handlePurchase = useCallback(async () => {
    setConfDlg("");
    const qty = inputQtyRef.current.value;
    const cost = inputCostRef.current.value;
    const id = elm.id;
    let costValid = true;
    //単価と数量のエラーチェック
    await BaseYup.number()
      .required()
      .integer()
      .min(0)
      .max(99999999)
      .label("単価")
      .validate(cost)
      .catch((res) => {
        costValid = false;
        const dom = document.getElementById(`${id}_cost`);
        dom.textContent = res.errors;
      });
    let qtyValid = true;
    await BaseYup.number()
      .required()
      .integer()
      .positive()
      .max(999)
      .label("数量")
      .validate(qty)
      .catch((res) => {
        qtyValid = false;
        const dom = document.getElementById(`${id}_qty`);
        dom.textContent = res.errors;
      });
    if (!(qtyValid && costValid)) return;
    elm.record.qty = qty;
    elm.record.cost = cost;
    //商品情報更新
    setItPData({ type: "item", data: elm, decide: true });
  }, [elm, setItPData]);
  //キャンセル処理
  const handleCancel = useCallback(() => {
    setConfDlg("");
    //商品情報更新
    setItPData({ type: "item", data: elm, decide: true });
  }, [elm, setItPData]);

  return (
    <>
      <div component="p" id={elm.id} className={classes.root}>
        <CustomizedSnackbars
          open={snackbar.open}
          handleClose={handleClose}
          severity={snackbar.severity}
          message={snackbar.message}
        />
        <ConfirmDialog
          msg={confirmDelete}
          isOpen={confDlg === "delete"}
          doYes={handleDelete}
          doNo={() => {
            setConfDlg("");
          }}
        />
        <ConfirmDialog
          msg={confirmPurchase}
          isOpen={confDlg === "purchase"}
          doYes={handlePurchase}
          doNo={() => {
            setConfDlg("");
          }}
        />
        <ConfirmDialog
          msg={confirmCancel}
          isOpen={confDlg === "cancel"}
          doYes={handleCancel}
          doNo={() => {
            setConfDlg("");
          }}
        />
        {itLoaging && <CircularIndeterminate component="p" />}
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            // aria-label="詳細"
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              <CardHeader
                component="span"
                // className={classes.heading}
                avatar={<Avatar className={classes.avatar}>{elm.id}</Avatar>}
                title={elm.name}
              />
              <CardContent className={classes.content}>
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  <label> 単価*:</label>
                  <TextField
                    id={`${elm.id}_costInput`}
                    style={{ width: 80 }}
                    type="number"
                    inputRef={(el) => (inputCostRef.current = el)}
                    defaultValue={elm.budget}
                    onChange={() => handleChange(`${elm.id}_cost`)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  円<p id={`${elm.id}_cost`} className="error"></p>
                </Typography>
                <Typography component="p" variant="body2" color="textSecondary">
                  <label> 数量*:</label>
                  <TextField
                    id={`${elm.id}_qtyInput`}
                    style={{ width: 80 }}
                    type="number"
                    inputRef={(el) => (inputQtyRef.current = el)}
                    defaultValue={1}
                    onChange={() => handleChange(`${elm.id}_qty`)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <p id={`${elm.id}_qty`} className="error"></p>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Button
                    className={classes.button}
                    onClick={() => setConfDlg("purchase")}
                    size="small"
                    variant="outlined"
                    color="primary"
                  >
                    購入
                  </Button>
                  <Button
                    className={classes.button}
                    onClick={() => setConfDlg("cancel")}
                    size="small"
                    variant="outlined"
                  >
                    キャンセル
                  </Button>
                  {/* <CardActions
                  className={classes.action}
                  component="p"
                  disableSpacing
                > */}
                  <IconButton aria-label="編集" onClick={() => handleEdit(elm)}>
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    aria-label="削除"
                    onClick={() => setConfDlg("delete")}
                  >
                    <DeleteForeverOutlinedIcon />
                  </IconButton>
                  {/* </CardActions> */}
                </Typography>
              </CardContent>
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <CardContent>
              <Typography component="div" paragraph>
                購入希望日：{elm.limit?.split("T")[0]}
              </Typography>
              <Typography component="div" paragraph>
                必要性：{elm.level}%
              </Typography>
              <Typography component="div" paragraph>
                比較商品：{selectCompares(compares, elm.id).join(",")}
              </Typography>
              <Typography component="div" paragraph>
                リンク:
              </Typography>
              <Typography component="div" paragraph>
                <a href={elm.url}>{elm.url}</a>
              </Typography>
              <Typography component="div" paragraph>
                メモ:
              </Typography>
              <Typography
                style={{ border: "solid 0.5px" }}
                component="div"
                paragraph
              >
                {elm.remark}
              </Typography>
            </CardContent>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
});

export default SimpleAccordion;
