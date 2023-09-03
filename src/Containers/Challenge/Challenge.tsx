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
import React, { useState } from "react";
import { IChallengeData } from "../../Transforms";
import Api from "../../Services/Api";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { IState } from "../../Reducers";
import { loggedIn } from "../../Reducers/Auth";
import { IUserSmallData } from "../../Transforms/User";
import { UserAvatar } from "../../Components/UserAvatar";
import { useNavigate } from "react-router-dom";

import dayjs, { unix } from "dayjs";
import { BackButton } from "../../Components/BackButton";
import { LoadingButton } from "../../Components/LoadingButton";
import { useCountdown } from "../../Hooks/CountDown";
import { yaUnS } from "../../Utils/yaUnS";

const UserListItem = (props: { user: IUserSmallData; rank: number }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <ListItem
      sx={{
        color: theme.palette.getContrastText(theme.palette.background.default),
      }}
      onClick={() => {navigate("/users/" + props.user.username)}}
    >
      <Typography sx={{ marginRight: 2 }}>{props.rank + 1}</Typography>
      <ListItemAvatar>
        <UserAvatar user={props.user} />
      </ListItemAvatar>
      <ListItemText
        primary={props.user.display_name}
        secondary={unix(props.user.time!).format("[Le] DD/MM/YYYY à HH:mm:ss")}
      />
    </ListItem>
  );
};

const generateUserList = (users: IUserSmallData[] | undefined) => {
  if (users === undefined) {
    return <></>;
  }
  return users
    .sort((a: IUserSmallData, b: IUserSmallData) => a.time! - b.time!)
    .map((data, index) => (
      <div key={index}>
        <UserListItem user={data} rank={index} />
        <Divider component="li" />
      </div>
    ));
};

const distToChall = (start: number, end: number) => {
  const now = dayjs().unix();
  if (start > now) {
    return now - start;
  } else if (end < now) {
    return now - end;
  } else {
    return 0;
  }
};

const DateCountDown = (props: { challengeData: IChallengeData }) => {
  const dist = distToChall(props.challengeData.start, props.challengeData.end);
  const targetDate =
    dist < 0
      ? props.challengeData.start
      : dist === 0
      ? props.challengeData.end
      : 0;

  var [days, hours, minutes, seconds] = useCountdown(
    unix(targetDate).valueOf()
  );

  if (targetDate === 0) {
    return <></>;
  }

  return (
    <Typography
      sx={{ ml: 1.5, mr: 1.5, textAlign: "center" }}
      color="text.primary"
    >
      {targetDate === props.challengeData.start ? "Commence " : "Se termine "}
      dans {days} jours, {hours} heures, <br />
      {minutes} minutes et {seconds} secondes.
    </Typography>
  );
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
  const userDoneChallenge = useSelector(
    (state: IState) => state.user.challenges_done
  );
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

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
    setLoadingButton(true);
    Api.apiCalls.REQUEST_CHALLENGE(id!).then((response) => {
      if (response.ok) {
        Api.apiCalls.GET_SELF().then(() => {
          setLoadingButton(false);
        });
      } else {
        setLoadingButton(false);
      }
    });
  };
  var background: string | undefined = undefined;
  if (
    challengeData &&
    challengeData.picture_id &&
    challengeData.picture_id != ""
  ) {
    background = Api.apiCalls.GET_PICTURE_URL(challengeData.picture_id);
  }
  return (
    <>
      <BackButton />
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
          {background ? (
            <img
              src={background}
              style={{
                maxWidth: "100%",
                width: "100%",
                borderBottom: "solid black",
                filter: `${Date.now()/1000 < challengeData.end && Date.now()/1000 > challengeData.start ? "" : "grayscale(1)"}`,
              }}
            />
          ) : (
            <Box
              style={{
                backgroundColor: `${Date.now()/1000 < challengeData.end && Date.now()/1000 > challengeData.start ? theme.palette.secondary.main : "gray"}`,
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
            {challengeData.name}
            <br />
            {challengeData.points} point
            {yaUnS(challengeData.points)}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Du{" "}
            <b>{unix(challengeData.start).toDate().toLocaleDateString("fr")}</b>{" "}
            au{" "}
            <b>{unix(challengeData.end).toDate().toLocaleDateString("fr")}</b>
          </Typography>
          <Divider flexItem />
          {distToChall(challengeData.start, challengeData.end) > 0 && (
            <Typography sx={{ mb: 1.5 }} color="text.primary">
              Ce challenge est terminé
            </Typography>
          )}

          <Typography
            sx={{ m: 1.5 }}
            color="text.primary"
            alignSelf={"flex-start"}
          >
            {challengeData.description}
          </Typography>
          <Divider sx={{ mb: 1.5 }} flexItem />
          <DateCountDown challengeData={challengeData} />
          {userLoggedIn && !isAdmin && (
            <LoadingButton
              color="success"
              disabled={
                userPendingChallenges.includes(id!) ||
                userDoneChallenge.includes(id!) ||
                distToChall(challengeData.start, challengeData.end) !== 0
              }
              onClick={requestChallengeValidation}
              loading={loadingButton}
            >
              {userPendingChallenges.includes(id!)
                ? "En attente de validation"
                : userDoneChallenge.includes(id!)
                ? "Challenge validé"
                : "Valider ce challenge"}
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
