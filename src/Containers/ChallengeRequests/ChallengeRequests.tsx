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
import React, {ReactNode, useState, useEffect} from "react";
import {UserAvatar} from "../../Components/UserAvatar";
import {useTheme} from "@mui/material/styles";
import Api from "../../Services/Api";
import {IChallengeData, IUserData} from "../../Transforms";
import {reduceUserData} from "../../Transforms/User";
import {ExpandLess, ExpandMore, StarBorder} from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import {useNavigate} from "react-router-dom";
import {BackButton} from "../../Components/BackButton";
import {yaUnS} from "../../Utils/yaUnS";
import CloseIcon from "@mui/icons-material/Close";

interface IUserListItem {
  user: IUserData;
  challenges: IChallengeData[];
}

const ChallengeListItem = (props: {
  data: IChallengeData | undefined;
  user: IUserData;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const validateChallenge = () => {
    Api.apiCalls
      .ACCEPT_CHALLENGE_REQUEST(props.user.username, props.data!.challenge)
      .then((response) => {
        navigate(0);
      });
  };

  const denyChallenge = () => {
    Api.apiCalls
      .ACCEPT_CHALLENGE_REQUEST(props.user.username, props.data!.challenge, true)
      .then((response) => {
        navigate(0);
      });
  }

  return (
    <>
      <Divider component="li"/>
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
            onClick={validateChallenge}
          >
            <CheckIcon sx={{color: "black"}}/>
          </IconButton>
          <IconButton
            size="small"
            sx={{
              marginLeft: 1,
              borderRadius: 0,
              backgroundColor: theme.palette.error.light,
              border: "solid black",
            }}
            onClick={denyChallenge}
          >
            <CloseIcon sx={{color: "black"}}/>
          </IconButton>
        </>
        }
      >
        <ListItemButton
          sx={{pl: 4, color: theme.palette.text.primary, marginRight: 8,}}
          onClick={() => navigate("/challenges/" + props.data?.challenge)}
        >
          <ListItemText
            primary={props.data?.name || ""}
            secondary={
              props.data?.points + " point" + yaUnS(props.data?.points) || ""
            }
          />
        </ListItemButton>
      </ListItem>
    </>
  );
};

const generateChallengeList = (
  challenges: string[],
  challengesData: IChallengeData[],
  user: IUserData
) => {
  return challenges.map((data: string, index: number) => {
    return (
      <div>
        <ChallengeListItem
          data={challengesData.find(
            (challenge) => challenge.challenge === data
          )}
          user={user}
        />
      </div>
    );
  });
};

const UserListItem = (props: IUserListItem) => {
  const [open, setOpen] = React.useState(true);

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
            badgeContent={props.user.challenges_pending.length}
            color="primary"
            max={9}
            overlap="circular"
          >
            <UserAvatar user={reduceUserData(props.user)}/>
          </Badge>
        </ListItemAvatar>

        <ListItemText
          primary={props.user.display_name}
          secondary={props.user.mail}
        />
        {open ? <ExpandLess/> : <ExpandMore/>}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {generateChallengeList(
            props.user.challenges_pending,
            props.challenges,
            props.user
          )}
        </List>
      </Collapse>
    </>
  );
};

const NoPendingValidation = () => {
  const theme = useTheme();
  return (
    <ListItem>
      <ListItemText sx={{pl: 4, color: theme.palette.text.primary}}>
        Aucune demande de validation.
      </ListItemText>
    </ListItem>
  );
};

const generateUserList = (
  users: IUserData[] | undefined,
  challenges: IChallengeData[] | undefined
) => {
  if (users === undefined || challenges === undefined) {
    return <></>;
  }

  let userWithPendingChallenges = users.filter(
    (user) => user.challenges_pending.length > 0
  );
  if (userWithPendingChallenges.length === 0) {
    return <NoPendingValidation/>;
  }
  return userWithPendingChallenges
    .sort((a: IUserData, b: IUserData) => {
      return b.challenges_pending.length - a.challenges_pending.length;
    })
    .map((data, index) => (
      <div key={index}>
        <UserListItem user={data} challenges={challenges!}/>
        <Divider component="li"/>
      </div>
    ));
};

const ChallengeRequest = () => {
  const [userList, setUserList] = useState<IUserData[] | undefined>();
  const [challengesList, setChallengesList] = useState<
    IChallengeData[] | undefined
  >();
  const theme = useTheme();
  React.useEffect(() => {
    Api.apiCalls.GET_ALL_USERS(true).then((response) => {
      if (response.ok) {
        setUserList(response.data);
      }
    });
    Api.apiCalls.GET_ALL_CHALLENGES().then((response) => {
      if (response.ok) {
        setChallengesList(response.data);
      }
    });
  }, []);
  return (
    <div>
      <BackButton/>
      <List
        sx={{
          bgcolor: "background.paper",
          boxShadow: `10px 10px 0px black`,
          border: "solid black",
          width: "500px",
          maxWidth: "90vw",
        }}
      >
        {generateUserList(userList, challengesList)}
      </List>
      <Backdrop
        sx={{color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={userList === undefined}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
    </div>
  );
};

export default ChallengeRequest;
