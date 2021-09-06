import { React } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import mainimg from "../../images/mainimg.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    backgroundImage: `url(${mainimg})`,
    height: "1200px",
    backgroundSize: "100% auto",
  },
  button1: {
    position: "absolute",
    textTransform: "none",
    top: "calc(50% - 50px)",
    left: "calc(50% - 90px)",
    margin: "100",
  },
  button2: {
    position: "absolute",
    textTransform: "none",
    top: "calc(50% - 50px)",
    left: "calc(50% + 90px)",
    margin: "100",
  },
}));

const Home = () => {
  const history = useHistory();
  const classes = useStyles();

  const handleSignIn = () => {
    history.push("/signin");
  };
  const handleSignUp = () => {
    history.push("/signup");
  };

  return (
    <div className={classes.root}>
      <Button
        className={classes.button1}
        type="button"
        onClick={handleSignIn}
        variant="contained"
        size="large"
        color="primary"
      >
        SignIn
      </Button>
      <Button
        className={classes.button2}
        type="button"
        onClick={handleSignUp}
        variant="contained"
        size="large"
        color="primary"
      >
        SignUp
      </Button>
    </div>
  );
};

export default Home;
