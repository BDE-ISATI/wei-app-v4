import {
  Box,
  Button,
  useTheme,
  TextField,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { DateTimePicker, DateTimeValidationError } from "@mui/x-date-pickers";
import Api from "../../Services/Api";
import { ITeamData, ITeamUpdateData } from "../../Transforms";
import { BackButton } from "../../Components/BackButton";
import { LoadingButton } from "../../Components/LoadingButton";

function EditTeam() {
  const [teamName, setteamName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const { id } = useParams();

  const [dateError, setDateError] =
    React.useState<DateTimeValidationError | null>(null);

  const theme = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    Api.apiCalls.GET_TEAM(id!).then((response) => {
      if (response.ok) {
        const teamData = response.data!;
        setteamName(teamData.display_name);
      }
      setLoaded(true);
    });
  }, []);

  const updateTeam = () => {
    if (!teamName) {
      setErrorMessage("Faut remplir tous les champs en fait");
      return;
    }
    setErrorMessage("");
    const teamData: ITeamUpdateData = {
      team: id!,
      display_name: teamName,
      picture_id: "",
    };
    setLoadingButton(true);
    Api.apiCalls.UPDATE_TEAM(teamData).then((response) => {
      setLoadingButton(false);
      if (response.ok) {
        navigate("/teams/" + id!);
      } else {
        setErrorMessage(response.data?.message);
      }
    });
  };

  return (
    <>
      <BackButton />
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: `10px 10px 0px black`,
          border: "solid black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
          width: "90vw",
          flex: 1,
        }}
      >
        <TextField
          sx={{ maxWidth: "600px", width: "100%", m: 1, marginTop: 2 }}
          error={teamName == null && errorMessage != undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="Nom de l'équipe"
          value={teamName ? teamName : ""}
          onChange={(event) => setteamName(event.target.value)}
        />

        <LoadingButton onClick={() => updateTeam()} loading={loadingButton}>
          Modifier l'équipe
        </LoadingButton>
        {errorMessage && (
          <Alert
            variant="outlined"
            severity="error"
            sx={{
              marginTop: 1,
              borderRadius: 0,
            }}
          >
            {errorMessage}
          </Alert>
        )}
      </Box>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={!loaded}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default EditTeam;
