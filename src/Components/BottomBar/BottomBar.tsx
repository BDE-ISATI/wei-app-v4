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
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import Paper from "@mui/material/Paper";
import { AvatarView, HeadShape, IAvatar } from "../MyAvatar";
import { useTheme } from "@mui/material/styles";

interface Props {
  onPageChanged: (index: number) => void;
}

const BottomBar: React.FC<Props> = (props) => {
  const [value, setValue] = React.useState(0);
  const [avatarHeadShape, setAvatarHeadShape] = React.useState<HeadShape>(
    HeadShape.circle
  );
  const theme = useTheme();

  const avatar: IAvatar = {
    headShape: avatarHeadShape,
  };

  return (
    <>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
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
            icon={<FontAwesomeIcon icon={faStar} size="xl" color="black" />}
            onClick={() => props.onPageChanged(0)}
          />
          <BottomNavigationAction
            icon={
              <FontAwesomeIcon icon={faRankingStar} size="xl" color="black" />
            }
            onClick={() => props.onPageChanged(1)}
          />
          <BottomNavigationAction
            icon={
              <FontAwesomeIcon icon={faUserCircle} size="xl" color="black" />
            }
            onClick={() => props.onPageChanged(2)}
          />
        </BottomNavigation>
      </Paper>
      <BottomNavigation />
    </>
  );
};

export default BottomBar;
