import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import HistoryOutlinedIcon from "@material-ui/icons/HistoryOutlined";
import QueueIcon from "@material-ui/icons/Queue";
import HomeIcon from "@material-ui/icons/Home";
const current = {
  color: "blue",
  textDecoration: "underline",
};

export const listItems = (
  <div>
    <Link exact="true" to="/mypage" activestyle={current}>
      <ListItem button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="MyPage" />
      </ListItem>
    </Link>
    <Link exact="true" to="/search" activestyle={current}>
      <ListItem button>
        <ListItemIcon>
          <SearchOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Search" />
      </ListItem>
    </Link>
    <Link exact="true" to="/register" activestyle={current}>
      <ListItem button>
        <ListItemIcon>
          <QueueIcon />
        </ListItemIcon>
        <ListItemText primary="Register" />
      </ListItem>
    </Link>
    <Link exact="true" to="/history" activestyle={current}>
      <ListItem button>
        <ListItemIcon>
          <HistoryOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="History" />
      </ListItem>
    </Link>
  </div>
);
