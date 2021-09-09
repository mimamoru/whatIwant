import React, { memo, useState } from "react";
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
import { useSignup } from "../../context/AuthUserContext";
import Container from "@material-ui/core/Container";
import { yupResolver } from "@hookform/resolvers/yup";
import { BaseYup } from "../modules/localeJP";
import { useForm, Controller } from "react-hook-form";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const classes = useStyles();
  const signup = useSignup();
  const [confirm, setcConfirm] = useState(false);

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

        <form onSubmit={handleSubmit((data) => signup(data))} className="form">
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
