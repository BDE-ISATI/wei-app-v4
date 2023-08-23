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
import { IChallengeData } from "../../Transforms";
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
      <ListItemText primary={props.user.display_name} />
    </ListItem>
  );
};

const generateUserList = (users: IUserSmallData[] | undefined) => {
  if (users === undefined) {
    return <></>;
  }
  return users.map((data, index) => (
    <div key={index}>
      <UserListItem user={data} />
      <Divider component="li" />
    </div>
  ));
};
const Challenge = () => {
  const [challengeData, setChallengeData] = React.useState<
    IChallengeData | undefined
  >();
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
  const isAdmin = useSelector((state: IState) => state.user.is_admin);
  const userPendingChallenges = useSelector(
    (state: IState) => state.user.challenges_pending
  );

  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    Api.apiCalls.GET_CHALLENGE(id!).then((response) => {
      if (response.ok) {
        setChallengeData(response.data);
      }
    });
  }, []);

  const requestChallengeValidation = () => {
    Api.apiCalls.REQUEST_CHALLENGE(id!).then((response) => {
      if (response.ok) {
        Api.apiCalls.GET_SELF();
      }
    });
  };
  return (
    <>
      {challengeData && (
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
              {challengeData.name}
              <br />
              {challengeData.points} point
              {challengeData.points > 1 ? "s" : ""}
            </Typography>
          </Box>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Du{" "}
            <b>{unix(challengeData.start).toDate().toLocaleDateString("fr")}</b>{" "}
            au{" "}
            <b>{unix(challengeData.end).toDate().toLocaleDateString("fr")}</b>
          </Typography>
          <Typography
            sx={{ mb: 1.5, ml: 1.5, mr: 1.5 }}
            color="text.primary"
            alignSelf={"flex-start"}
          >
            {challengeData.description}
          </Typography>
          {userLoggedIn && !isAdmin && (
            <Button
              variant="contained"
              color="success"
              disabled={userPendingChallenges.includes(id!)}
              sx={{
                marginTop: 5,
                marginBottom: 5,
                maxWidth: "300px",
                width: "100%",
                borderRadius: 0,
              }}
              onClick={requestChallengeValidation}
            >
              {userPendingChallenges.includes(id!)
                ? "En attente de validation"
                : "Valider ce challenge"}
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
              Modifier ce challenge
            </Button>
          )}
          <Divider flexItem>
            <Typography color="text.secondary">Classement</Typography>
          </Divider>
          {challengeData.users.length > 0 ? (
            <List sx={{ alignSelf: "flex-start", width: "100%" }}>
              {generateUserList(challengeData.users)}
            </List>
          ) : (
            <Typography color="text.secondary">
              Personne n'a encore réalisé ce challenge!
            </Typography>
          )}
        </Box>
      )}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={challengeData === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Challenge;
