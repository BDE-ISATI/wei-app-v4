import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { IChallengeData, ITeamData } from "../../Transforms";
import Api from "../../Services/Api";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { IState } from "../../Reducers";
import { loggedIn } from "../../Reducers/Auth";
import { IUserSmallData } from "../../Transforms/User";
import { UserAvatar } from "../../Components/UserAvatar";
import { useNavigate } from "react-router-dom";

import { unix } from "dayjs";

const UserListItem = (props: { user: IUserSmallData }) => {
  const theme = useTheme();
  return (
    <ListItem
      sx={{
        color: theme.palette.getContrastText(theme.palette.background.default),
      }}
    >
      <ListItemAvatar>
        <UserAvatar user={props.user} />
      </ListItemAvatar>
      <ListItemText
        primary={props.user.display_name}
        secondary={
          props.user.points + " point" + (props.user.points! > 1 ? "s" : "")
        }
      />
    </ListItem>
  );
};

const generateUserList = (users: IUserSmallData[] | undefined) => {
  if (users === undefined) {
    return <></>;
  }
  return users
    .sort((a: IUserSmallData, b: IUserSmallData) => {
      return b.points! - a.points!;
    })
    .map((data, index) => (
      <div key={index}>
        <UserListItem user={data} />
        <Divider component="li" />
      </div>
    ));
};
const Team = () => {
  const [teamData, setTeamData] = React.useState<ITeamData | undefined>();
  const username = useSelector((state: IState) => state.user.username);
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
  const isAdmin = useSelector((state: IState) => state.user.is_admin);

  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    Api.apiCalls.GET_TEAM(id!).then((response) => {
      if (response.ok) {
        setTeamData(response.data);
      }
    });
  }, []);

  const requestJoinTeam = () => {
    Api.apiCalls.JOIN_TEAM(id!).then((response) => {
      if (response.ok) {
        Api.apiCalls.GET_TEAM(id!).then((response) => {
          if (response.ok) {
            setTeamData(response.data);
          }
        });
      }
    });
  };
  return (
    <>
      {teamData && (
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: `10px 10px 0px black`,
            border: "solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90vw",
            flex: 1,
          }}
        >
          <Box
            style={{
              backgroundColor: `${theme.palette.secondary.main}`,
              width: "100%",
              borderBottom: "solid black",
            }}
          >
            <Typography
              color={theme.palette.getContrastText(theme.palette.primary.main)}
              sx={{ fontWeight: 800, textAlign: "center", margin: 2 }}
            >
              {teamData.display_name}
              <br />
              {teamData.points} point
              {teamData.points > 1 ? "s" : ""}
            </Typography>
          </Box>
          {userLoggedIn && !isAdmin && (
            <Button
              variant="contained"
              color="success"
              disabled={
                teamData.pending.includes(username) ||
                teamData.members.map((x) => x.username).includes(username)
              }
              sx={{
                marginTop: 5,
                marginBottom: 5,
                maxWidth: "300px",
                width: "100%",
                borderRadius: 0,
              }}
              onClick={requestJoinTeam}
            >
              {teamData.pending.includes(username)
                ? "En attente de validation"
                : teamData.members.map((x) => x.username).includes(username)
                ? "Vous êtes dans cette équipe!"
                : "Rejoindre cette équipe"}
            </Button>
          )}
          {userLoggedIn && isAdmin && (
            <Button
              variant="contained"
              color="warning"
              sx={{
                marginTop: 5,
                marginBottom: 5,
                maxWidth: "300px",
                width: "100%",
                borderRadius: 0,
              }}
              onClick={() => navigate("edit")}
            >
              Modifier cette équipe
            </Button>
          )}
          <Divider flexItem>
            <Typography color="text.secondary">Membres</Typography>
          </Divider>
          {teamData.members.length > 0 ? (
            <List sx={{ alignSelf: "flex-start", width: "100%" }}>
              {generateUserList(teamData.members)}
            </List>
          ) : (
            <Typography color="text.secondary">
              Personne n'est dans cette équipe...
            </Typography>
          )}
        </Box>
      )}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={teamData === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Team;
