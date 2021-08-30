import { React, useState, useEffect, useCallback, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useHistory } from "react-router-dom";
import ReactSelect from "react-select";
import { useUserItems } from "../../context/UserItemsContext";
import { useUserCompares } from "../../context/UserComparesContext";
import { getData } from "../modules/myapi";
import { useAuthUser } from "../../context/AuthUserContext";
import GenericTemplate from "../modules/GenericTemplate";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import mainimg from "../../images/mainimg.jpg"; 

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    //  backgroundImage: `url(${mainimg})`,
    height: "1200px",
    backgroundSize: "100% auto",
  },
  button: {
    position: "absolute",
    textTransform: "none",
    top: "calc(50% - 50px)",
    left: "calc(50% - 50px)",
    margin: "100",
  },
}));

const Mypage = () => {
  const history = useHistory();
  const classes = useStyles();

  const items = useUserItems();
  const compares = useUserCompares();
  const authUser = useAuthUser();

  const [data, setData] = useState(true);
  console.log(items, compares,authUser);
  return (
    <GenericTemplate title="マイページ">
      <div id="wrapper" className={classes.root}>
        サンプル
        <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={()=>setData(pre=>!pre)}
              >
                ユーザー登録
              </Button>
      </div>
    </GenericTemplate>
  );
};

export default Mypage;
