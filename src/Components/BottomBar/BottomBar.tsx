import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Avatar from "@mui/material/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRankingStar,
  faStar,
  faUser,
  faUserCircle,
  faUserGroup,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";

import { Link } from "react-router-dom";

const BottomBar = () => {
  const pathname = window.location.pathname;
  const [value, setValue] = React.useState(pathname);
  if (value === "/") {
    setValue("/challenges");
  }
  const onChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: any
  ) => {
    setValue(newValue);
  };

  const theme = useTheme();

  return (
    <>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={onChange}
          sx={{
            borderTop: "solid black",
            color: theme.palette.secondary.main,
            "&  .Mui-selected > svg": {
              color: theme.palette.secondary.main,
            },
            background: theme.palette.action.disabledOpacity,
          }}
        >
          <BottomNavigationAction
            component={Link}
            to="/challenges"
            value={"/challenges" || "/"}
            icon={<FontAwesomeIcon icon={faStar} size="xl" color="black" />}
          />
          <BottomNavigationAction
            component={Link}
            to="/scoreboard"
            value={"/scoreboard"}
            icon={
              <FontAwesomeIcon icon={faRankingStar} size="xl" color="black" />
            }
          />
          <BottomNavigationAction
            component={Link}
            to="/teams"
            value={"/teams"}
            icon={
              <FontAwesomeIcon icon={faUserGroup} size="xl" color="black" />
            }
          />
          <BottomNavigationAction
            component={Link}
            to="/account"
            value={"/account"}
            icon={
              <FontAwesomeIcon icon={faUserCircle} size="xl" color="black" />
            }
          />
        </BottomNavigation>
      </Paper>
      <BottomNavigation />
    </>
  );
};

export default BottomBar;
