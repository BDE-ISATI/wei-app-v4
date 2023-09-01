import {
  List,
  ListItemText,
  Divider,
  Backdrop,
  CircularProgress,
  ListItemButton,
  ListSubheader,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Api from "../../Services/Api";
import { IChallengeData } from "../../Transforms";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../Components/BackButton";
import { useSelector } from "react-redux";
import { IState } from "../../Reducers";
import { IUserStateImmutable } from "../../Reducers/User";
import { yaUnS } from "../../Utils/yaUnS";

const GenerateChallengeList = (props: {
  user: IUserStateImmutable;
  challenges: IChallengeData[] | undefined;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  if (props.challenges === undefined) {
    return <></>;
  }
  return (
    <>
      <ListSubheader>Validés</ListSubheader>
      <Divider component="li" />
      {props.user.challenges_done.length === 0 ? (
        <ListItemText
          sx={{ pl: 4, color: theme.palette.text.disabled }}
          primary={"Vous n'avez validé aucun challenge."}
        />
      ) : (
        props.user.challenges_done.map((challenge, index) => {
          const data = props.challenges?.find((x) => x.challenge === challenge);
          return (
            <div key={"validated" + index}>
              <ListItemButton
                onClick={() => navigate("/challenges/" + challenge)}
              >
                <ListItemText
                  sx={{ pl: 4, color: theme.palette.text.primary }}
                  primary={data?.name}
                  secondary={data?.points + " point" + yaUnS(data?.points)}
                />
              </ListItemButton>
              <Divider component="li" />
            </div>
          );
        })
      )}
      <ListSubheader>En cours de validation</ListSubheader>
      <Divider component="li" />
      {props.user.challenges_pending.length === 0 ? (
        <ListItemText
          sx={{ pl: 4, color: theme.palette.text.disabled }}
          primary={"Vous n'avez aucun challenge en cours de validation."}
        />
      ) : (
        props.user.challenges_pending.map((challenge, index) => {
          const data = props.challenges?.find((x) => x.challenge === challenge);
          return (
            <div key={"pending" + index}>
              <ListItemButton
                onClick={() => navigate("/challenges/" + challenge)}
              >
                <ListItemText
                  sx={{ pl: 4, color: theme.palette.text.secondary }}
                  primary={data?.name}
                  secondary={data?.points + " point" + yaUnS(data?.points)}
                />
              </ListItemButton>
              <Divider component="li" />
            </div>
          );
        })
      )}
    </>
  );
};

const TeamRequests = () => {
  const user = useSelector((state: IState) => state.user);
  const [challengesList, setChallengesList] = useState<
    IChallengeData[] | undefined
  >();
  React.useEffect(() => {
    Api.apiCalls.GET_ALL_CHALLENGES().then((response) => {
      if (response.ok) {
        setChallengesList(response.data);
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
        <GenerateChallengeList user={user} challenges={challengesList} />
      </List>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={challengesList === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default TeamRequests;
