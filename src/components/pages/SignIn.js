import React, { memo, useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useSignin } from "../../context/AuthUserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { BaseYup } from "../modules/localeJP";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
//バリデーションの指定
const schema = BaseYup.object().shape({
  mail: BaseYup.string().required().email().label("メールアドレス"),
  password: BaseYup.string()
    .required()
    .min(8)
    .max(50)
    .minValid()
    .label("パスワード"),
});
//FORMデフォルト値の指定
const defaultValues = {
  mail: "",
  password: "",
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const SignIn = memo(() => {
  const history = useHistory();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const classes = useStyles();

  //サインインcontext
  const signin = useSignin();

  const [confirm, setcConfirm] = useState(false);

  const handlePageChange = () => {
    history.push("/signup");
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ようこそ
        </Typography>
        <form onSubmit={handleSubmit((data) => signin(data))} className="form">
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
          <Button
            id="button"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!confirm}
          >
            はじめる
          </Button>
          <Grid container>
            <Grid item>
              アカウントをお持ちではありませんか?
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handlePageChange}
              >
                ユーザー登録
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
});

export default SignIn;
