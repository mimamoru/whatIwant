import { useState, memo, useEffect, useRef, useCallback } from "react";

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
  details: {
    position: "absolute",
    display: "inline-block",
    width: 350,
    top: 250,
    zIndex: 100,
    backgroundColor: "white",
  },
  heading: {
    width: 300,
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

//?????????????????????????????????????????????
const selectCompares = (compares, itemId) => {
  if (!compares) return [];
  const arr = [];
  compares
    .filter((e) => itemId === e.compare0 || itemId === e.compare1)
    .forEach((e) => arr.push(...[e.compare0, e.compare1]));
  return [...new Set(arr.filter((e) => e !== itemId))].sort();
};

//????????????????????????????????????
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

//????????????????????????
const SimpleAccordion = memo(({ elm, allCondition }) => {
  const history = useHistory();
  const classes = useStyles();

  //??????????????????????????????
  const { compares } = useUserCompares();
  //??????????????????????????????
  const { items } = useUserItems();

  //??????????????????hook(1???)
  const [{ data: item, isLoading: itLoaging, isError: itErr }, setItId] =
    useGetData();
  //????????????hook
  const [{ id: itId, isError: itPErr }, setItPData] = usePutData();
  //????????????hook(?????????)
  const [{ result, itPErr: itDErr }, setCondition] = usePutDataEx();

  //??????(????????????)?????????
  const inputQtyRef = useRef(null);
  //??????(????????????)?????????
  const inputCostRef = useRef(null);

  //????????????????????????????????????????????????????????????????????????
  const [confDlg, setConfDlg] = useState("");

  //?????????????????????????????????
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  //????????????????????????????????????
  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackbar({ ...snackbar, open: false });
    },
    [snackbar]
  );

  //????????????????????????
  const handleEdit = useCallback(
    (elm) => {
      const id = elm.id;
      //????????????????????????????????????
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
    //?????????????????????????????????????????????????????????????????????????????????????????????????????????
    if (item.record?.decideDate || item.delete === true) {
      setSnackbar({ open: true, severity: "warning", message: change });
      return;
    }
    const compareArr = selectCompares(compares, item.id);

    //?????????????????????????????????????????????(??????????????????????????????????????????
    const option = items
      .filter((e) => compareArr.indexOf(e.id) !== -1)
      .map((e) => ({ value: e.id, label: `${e.id}:${e.name}` }));

    //???????????????????????????????????????????????????????????????????????????????????????
    history.push("/edit", {
      condition: allCondition,
      itemInfo: item,
      option: option,
    });
  }, [allCondition, history, itErr, item, compares, items]);

  //??????????????????
  const handleDelete = useCallback(() => {
    setConfDlg("");
    const id = elm.id;
    const deleteCompareData = selectCompares(compares, id);

    elm.delete = true;

    setCondition({
      putItemData: elm,
      postCompareData: [],
      deleteCompareData: deleteCompareData,
    });
  }, [compares, elm, setCondition]);

  //???????????????????????????
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
          //???????????????????????????????????????????????????
          const dom = document.getElementById(elm.id);
          if (dom) dom.style.display = "none";
        }
      }
    };
    func();
    // clean up?????????Unmount???????????????
    return () => {
      unmounted = true;
    };
  }, [elm, itDErr, result]);

  //???????????????????????????
  useEffect(() => {
    let unmounted = false;
    const func = async () => {
      if (elm && !unmounted) {
        if (itPErr) {
          //???????????????????????????????????????????????????????????????????????????????????????
          const message =
            itPErr === "changed"
              ? change
              : itPErr === "notFound"
              ? notFound
              : err;
          setSnackbar({ open: true, severity: "error", message: message });
        } else if (itId) {
          //?????????????????????????????????????????????????????????
          const message = elm.record?.qty ? purchase : cancel;
          setSnackbar({ open: true, severity: "success", message: message });
          await _sleep(2000);
          const dom = document.getElementById(elm.id);
          if (dom) dom.style.display = "none";
        }
      }
    };
    func();
    // clean up?????????Unmount???????????????
    return () => {
      unmounted = true;
    };
  }, [elm, itId, itPErr]);

  //????????????
  const handlePurchase = useCallback(async () => {
    if (itId) return;
    setConfDlg("");
    const qty = inputQtyRef.current.value;
    const cost = inputCostRef.current.value;
    const id = elm.id;
    let costValid = true;
    //???????????????????????????????????????
    await BaseYup.number()
      .required()
      .integer()
      .min(0)
      .max(99999999)
      .label("??????")
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
      .label("??????")
      .validate(qty)
      .catch((res) => {
        qtyValid = false;
        const dom = document.getElementById(`${id}_qty`);
        dom.textContent = res.errors;
      });
    if (!(qtyValid && costValid)) return;
    elm.record.qty = qty;
    elm.record.cost = cost;
    //??????????????????
    setItPData({ type: "item", data: elm, decide: true });
  }, [elm, setItPData, itId]);
  //?????????????????????
  const handleCancel = useCallback(() => {
    if (itId) return;
    setConfDlg("");
    //??????????????????
    setItPData({ type: "item", data: elm, decide: true });
  }, [elm, setItPData, itId]);

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
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography component="div" className={classes.heading}>
              <CardHeader
                avatar={<Avatar className={classes.avatar}>{elm.id}</Avatar>}
                title={elm.name}
              />
              <CardContent className={classes.content}>
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  <label> ??????*:</label>
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
                  ???<p id={`${elm.id}_cost`} className="error"></p>
                </Typography>
                <Typography
                  component="div"
                  variant="body2"
                  color="textSecondary"
                >
                  <label> ??????*:</label>
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
                    ??????
                  </Button>
                  <Button
                    className={classes.button}
                    onClick={() => setConfDlg("cancel")}
                    size="small"
                    variant="outlined"
                  >
                    ???????????????
                  </Button>
                  <IconButton aria-label="??????" onClick={() => handleEdit(elm)}>
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    aria-label="??????"
                    onClick={() => setConfDlg("delete")}
                  >
                    <DeleteForeverOutlinedIcon />
                  </IconButton>
                </Typography>
              </CardContent>
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <CardContent component="div">
              <Typography component="div" paragraph>
                ??????????????????{elm.limit?.split(" ")[0]}
              </Typography>
              <Typography component="div" paragraph>
                ????????????{elm.level}%
              </Typography>
              <Typography component="div" paragraph>
                ???????????????{selectCompares(compares, elm.id).join(",")}
              </Typography>
              <Typography component="div" paragraph>
                ?????????:
              </Typography>
              <Typography component="div" paragraph>
                <a href={elm.url}>{elm.url}</a>
              </Typography>
              <Typography component="div" paragraph>
                ??????:
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
