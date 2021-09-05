import React, {
  memo,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import CustomizedSnackbars from "../atoms/CustomizedSnackbars";
import { signUpErr } from "../modules/messages";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser, useSignin } from "../../context/AuthUserContext";
import Container from "@material-ui/core/Container";
import { yupResolver } from "@hookform/resolvers/yup";
import { BaseYup } from "../modules/localeJP";
import { useForm, Controller } from "react-hook-form";
import { useSelectDatas, usePostData } from "../queryhooks/index";
import CircularIndeterminate from "../atoms/CircularIndeterminate";
import { useHistory } from "react-router-dom";
//バリデーションの指定
const schema = BaseYup.object().shape({
  name: BaseYup.string().required().max(50).label("名前"),
  mail: BaseYup.string().required().email().label("メールアドレス"),
  password: BaseYup.string()
    .required()
    .min(8)
    .max(50)
    .minValid()
    .label("パスワード"),
  passwordConfirmation: BaseYup.string()
    .required()
    .oneOf([BaseYup.ref("password")])
    .label("パスワード(確認用)"),
});
//FORMデフォルト値の指定
const defaultValues = {
  mail: "",
  password: "",
  passwordConfirmation: "",
  name: "",
};
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
    textTransform: "none",
  },
  button: {
    margin: theme.spacing(1),
    textTransform: "none",
  },
}));

const SignUp = memo(() => {
  const history = useHistory();
  const authUser = useAuthUser();
  console.log(authUser);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const classes = useStyles();
  const signin = useSignin();
  const [confirm, setcConfirm] = useState(false);

  //ユーザー情報取得hook
  const [{ data: user, isLoading: usLoaging, isError: usErr }, setUsCondition] =
    useSelectDatas();
  //ユーザー情報登録hook
  const [{ id, isLoading: usPLoaging, isError: usPErr }, setusPData] =
    usePostData();

  const [formData, setFormData] = useState(null);

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

  useEffect(() => {
    //    console.log(formData, usErr,user);
    if (!formData) {
      return;
    }
    let unmounted = false;
    const signUpValid = () => {
      if (!unmounted) {
        setUsCondition({
          type: "user",
          param: `?mail=${formData.mail}`,
        });
      }
    };
    signUpValid();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [formData, setUsCondition]);

  useEffect(() => {
    // console.log(formData, authUser, user);
    if (!user) return;
    let unmounted = false;

    console.log(user);
    if (user && user.length > 0) {
      setSnackbar({ open: true, severity: "error", message: signUpErr });
      unmounted = true;
      return;
    }
    const handleSignUp = () => {
      if (!unmounted) {
        setusPData({
          type: "user",
          data: {
            id: null,
            name: formData.name,
            mail: formData.mail,
            password: formData.password,
            record: {
              createDate: "",
              recordDate: "",
            },
          },
        });
      }
    };
    handleSignUp();
    // clean up関数（Unmount時の処理）
    return () => {
      unmounted = true;
    };
  }, [user, formData, setusPData]);

  useEffect(() => {
    if (!id) {
      return;
    }
    console.log(formData.mail, formData.password);
    signin(formData.mail, formData.password);
  }, [formData, id, signin]);

  const handlePageChange = () => {
    history.push("/signin");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Hello!
        </Typography>
        <CustomizedSnackbars
          open={snackbar.open}
          handleClose={handleClose}
          severity={snackbar.severity}
          message={snackbar.message}
        />
        {usLoaging && <CircularIndeterminate component="div" />}
        <form
          onSubmit={handleSubmit((data) => setFormData(data))}
          className="form"
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="お名前*"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    id="name"
                  />
                )}
              />
              <p className="error">{errors.name?.message}</p>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="mail"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="メールアドレス*"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <p className="error">{errors.mail?.message}</p>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="パスワード*"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    type="password"
                    id="password"
                  />
                )}
              />
              <p className="error">{errors.password?.message}</p>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="パスワード(確認用)*"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    type="password"
                    id="passwordConfirmation"
                  />
                )}
              />
              <p className="error">{errors.passwordConfirmation?.message}</p>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="notRobot"
                    color="primary"
                    onChange={() => setcConfirm((pre) => !pre)}
                  />
                }
                label="私はロボットではありません"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!confirm}
          >
            登録
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              すでにアカウントをお持ちですか?
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handlePageChange}
              >
                SignIn
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
});
export default SignUp;
