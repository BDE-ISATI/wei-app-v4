import { Box, Button, useTheme, TextField, Alert } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateTimeValidationError } from "@mui/x-date-pickers";
import Api from "../../Services/Api";
import { ITeamUpdateData } from "../../Transforms";
import { validIDRegex } from "../../Config/AppConfig";

function CreateTeam() {
  const [teamId, setteamId] = useState<string | null>(null);
  const [teamName, setteamName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const [dateError, setDateError] =
    React.useState<DateTimeValidationError | null>(null);

  const theme = useTheme();
  const navigate = useNavigate();

  const createteam = () => {
    setErrorMessage("");
    if (!teamId || !teamName) {
      setErrorMessage("Faut remplir tous les champs en fait");
      return;
    }
    if (!validIDRegex.test(teamId)) {
      setErrorMessage("L'ID de l'équipe ne peux pas contenir de caractères spéciaux");
      return;
    }
    const teamData: ITeamUpdateData = {
      team: teamId,
      display_name: teamName,
      picture_id: "",
    };
    Api.apiCalls.CREATE_TEAM(teamData).then((response) => {
      if (response.ok) {
        navigate("/teams/" + teamId);
      } else {
        setErrorMessage(response.data?.message);
      }
    });
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: `10px 10px 0px black`,
          border: "solid black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "90vw",
          padding: "10px",
          flex: 1,
        }}
      >
        <TextField
          sx={{ maxWidth: "600px", width: "100%", m: 1, marginTop: 4 }}
          error={teamId == null && errorMessage != undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="ID de l'équipe"
          value={teamId}
          onChange={(event) => setteamId(event.target.value)}
        />
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
          value={teamName}
          onChange={(event) => setteamName(event.target.value)}
        />

        <Button
          variant="contained"
          sx={{
            marginTop: 5,
            maxWidth: "600px",
            width: "100%",
            borderRadius: 0,
          }}
          onClick={() => createteam()}
        >
          Créer l'équipe
        </Button>
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
    </>
  );
}

export default CreateTeam;
