import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Typography,
  Backdrop,
  CircularProgress,
  Badge,
  ListItemButton,
  ListItemIcon,
  Collapse,
  IconButton,
} from "@mui/material";
import React, { ReactNode, useState, useEffect } from "react";
import { UserAvatar } from "../../Components/UserAvatar";
import { useTheme } from "@mui/material/styles";
import Api from "../../Services/Api";
import { IChallengeData, ITeamData, IUserData } from "../../Transforms";
import { reduceUserData } from "../../Transforms/User";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../Components/BackButton";
import CloseIcon from "@mui/icons-material/Close";

interface ITeamListItem {
  team: ITeamData;
  users: IUserData[];
}

const UserListItem = (props: {
  user: IUserData | undefined;
  team: ITeamData;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const validateTeam = () => {
    Api.apiCalls
      .ACCEPT_JOIN_TEAM(props.user!.username, props.team.team)
      .then((response) => {
        navigate(0);
      });
  };

  const denyTeam = () => {
    Api.apiCalls
      .ACCEPT_JOIN_TEAM(props.user!.username, props.team.team, true)
      .then((response) => {
        navigate(0);
      });
  };

  return (
    <>
      <BackButton />
      <Divider component="li" />
      <ListItem
        secondaryAction={
          <>
            <IconButton
              size="small"
              sx={{
                marginLeft: "auto",
                borderRadius: 0,
                backgroundColor: theme.palette.success.light,
                border: "solid black",
              }}
              onClick={validateTeam}
            >
              <CheckIcon sx={{ color: "black" }} />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                marginLeft: 1,
                borderRadius: 0,
                backgroundColor: theme.palette.error.light,
                border: "solid black",
              }}
              onClick={denyTeam}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </>
        }
      >
        <ListItemButton
          sx={{ pl: 4, color: theme.palette.text.primary, marginRight: 8 }}
        >
          <ListItemText
            primary={props.user?.display_name || ""}
            secondary={props.user?.mail}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
};

const generateUserList = (team: ITeamData, users: IUserData[]) => {
  return team.pending.map((data: string, index: number) => {
    return (
      <div>
        <UserListItem
          user={users.find((user) => user.username === data)}
          team={team}
        />
      </div>
    );
  });
};

const TeamListItem = (props: ITeamListItem) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const theme = useTheme();
  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          color: theme.palette.getContrastText(
            theme.palette.background.default
          ),
        }}
      >
        <ListItemAvatar>
          <Badge
            badgeContent={props.team.pending.length}
            color="primary"
            max={9}
            overlap="circular"
          >
            <Avatar sx={{ border: "solid black" }} />
          </Badge>
        </ListItemAvatar>

        <ListItemText primary={props.team.display_name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {generateUserList(props.team, props.users)}
        </List>
      </Collapse>
    </>
  );
};

const NoPendingValidation = () => {
  const theme = useTheme();
  return (
    <ListItem>
      <ListItemText sx={{ pl: 4, color: theme.palette.text.primary }}>
        Personne n'attend pour rejoindre une équipe!
      </ListItemText>
    </ListItem>
  );
};

const generateTeamList = (
  teams: ITeamData[] | undefined,
  users: IUserData[] | undefined
) => {
  if (users === undefined || teams === undefined) {
    return <></>;
  }

  let teamsWithPendingUsers = teams.filter((team) => team.pending.length > 0);
  if (teamsWithPendingUsers.length === 0) {
    return <NoPendingValidation />;
  }
  return teamsWithPendingUsers
    .sort((a: ITeamData, b: ITeamData) => {
      return b.pending.length - a.pending.length;
    })
    .map((data, index) => (
      <div key={index}>
        <TeamListItem team={data} users={users!} />
        <Divider component="li" />
      </div>
    ));
};

const TeamRequests = () => {
  const [teamList, setTeamList] = useState<ITeamData[] | undefined>();
  const [userList, setUserList] = useState<IUserData[] | undefined>();
  const theme = useTheme();
  React.useEffect(() => {
    Api.apiCalls.GET_ALL_TEAMS(true).then((response) => {
      if (response.ok) {
        setTeamList(response.data);
      }
    });
    Api.apiCalls.GET_ALL_USERS().then((response) => {
      if (response.ok) {
        setUserList(response.data);
      }
    });
  }, []);
  return (
    <div>
      <BackButton />
      <List
        sx={{
          bgcolor: "background.paper",
          boxShadow: `10px 10px 0px black`,
          border: "solid black",
          width: "500px",
          maxWidth: "90vw",
        }}
      >
        {generateTeamList(teamList, userList)}
      </List>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={teamList === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default TeamRequests;
