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
import React, {useState} from "react";
import {ITeamData} from "../../Transforms";
import Api from "../../Services/Api";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {IState} from "../../Reducers";
import {loggedIn} from "../../Reducers/Auth";
import {IUserSmallData} from "../../Transforms/User";
import {UserAvatar} from "../../Components/UserAvatar";
import {useNavigate} from "react-router-dom";

import {BackButton} from "../../Components/BackButton";
import {LoadingButton} from "../../Components/LoadingButton";
import {yaUnS} from "../../Utils/yaUnS";

const UserListItem = (props: { user: IUserSmallData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <ListItem
      sx={{
        color: theme.palette.getContrastText(theme.palette.background.default),
      }}
      onClick={() => {navigate("/users/" + props.user.username)}}
    >
      <ListItemAvatar>
        <UserAvatar user={props.user}/>
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
        <UserListItem user={data}/>
        <Divider component="li"/>
      </div>
    ));
};
const Team = () => {
  const [teamData, setTeamData] = React.useState<ITeamData | undefined>();
  const [allTeamData, setAllTeamData] = React.useState<ITeamData[] | undefined>();
  const username = useSelector((state: IState) => state.user.username);
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
  const isAdmin = useSelector((state: IState) => state.user.is_admin);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const theme = useTheme();
  const {id} = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    Api.apiCalls.GET_TEAM(id!).then((response) => {
      if (response.ok) {
        setTeamData(response.data);
      }
    });
    Api.apiCalls.GET_ALL_TEAMS().then((response) => {
      if (response.ok) {
        setAllTeamData(response.data);
      }
    });
  }, []);

  const requestJoinTeam = () => {
    setLoadingButton(true);
    Api.apiCalls.JOIN_TEAM(id!).then((response) => {
      setLoadingButton(false);
      if (response.ok) {
        Api.apiCalls.GET_TEAM(id!, true).then((response) => {
          if (response.ok) {
            setTeamData(response.data);
          }
        });
      }
    });
  };
  var background: string | undefined = undefined;
  if (teamData && teamData.picture_id && teamData.picture_id !== "") {
    background = Api.apiCalls.GET_PICTURE_URL(teamData.picture_id);
  }
  return (
    <>
      <BackButton/>
      {teamData && allTeamData && (
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
          {background ? (
            <img
              src={background}
              style={{
                maxWidth: "100%",
                width: "100%",
                borderBottom: "solid black",
              }}
            />
          ) : (
            <Box
              style={{
                backgroundColor: `${theme.palette.secondary.main}`,
                width: "100%",
                borderBottom: "solid black",
                height: "30px",
              }}
            />
          )}
          <Typography
            color="text.primary"
            sx={{
              alignSelf: "center",
              textAlign: "center",
              fontWeight: 800,
              marginBottom: 2,
              marginTop: 2,
              wordBreak: "break-word",
            }}
          >
            {teamData.display_name}
            <br/>
            {teamData.points} point
            {yaUnS(teamData.points)}
          </Typography>
          {userLoggedIn && !isAdmin && (
            <LoadingButton
              color="success"
              disabled={
                teamData.pending.includes(username) ||
                teamData.members.map((x) => x.username).includes(username) ||
                allTeamData.filter((x) => x.pending.includes(username) || x.members.filter((x) => x.username === username).length > 0).length > 0
              }
              onClick={requestJoinTeam}
              loading={loadingButton}
            >
              {
                teamData.pending.includes(username)
                  ? "En attente de validation"
                  : allTeamData.filter((x) => x.pending.includes(username) || x.members.filter((x) => x.username === username).length > 0).length > 0
                    ? "Vous êtes déjà dans une équipe!"
                    : teamData.members.map((x) => x.username).includes(username)
                      ? "Vous êtes dans cette équipe!"
                      : "Rejoindre cette équipe"}
            </LoadingButton>
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
            <List sx={{alignSelf: "flex-start", width: "100%"}}>
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
        <CircularProgress color="inherit"/>
      </Backdrop>
    </>
  );
};

export default Team;
