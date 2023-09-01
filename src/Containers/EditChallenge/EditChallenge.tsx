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
import dayjs, { Dayjs, unix } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { DateTimePicker, DateTimeValidationError } from "@mui/x-date-pickers";
import Api from "../../Services/Api";
import { IChallengeUpdateData } from "../../Transforms/Challenge";
import { BackButton } from "../../Components/BackButton";
import { LoadingButton } from "../../Components/LoadingButton";

function EditChallenge() {
  const { id } = useParams();
  const [challengeName, setChallengeName] = useState<string | null>(null);
  const [challengeDescription, setChallengeDescription] = useState<
    string | null
  >(null);
  const [challengePoints, setChallengePoints] = useState<number | null>(null);
  const [challengeStartDate, setChallengeStartDate] = useState<Dayjs | null>(
    null
  );
  const [challengeEndDate, setChallengeEndDate] = useState<Dayjs | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const [dateError, setDateError] =
    React.useState<DateTimeValidationError | null>(null);

  React.useEffect(() => {
    Api.apiCalls.GET_CHALLENGE(id!).then((response) => {
      if (response.ok) {
        const challengeData = response.data!;
        setChallengeName(challengeData.name);
        setChallengeDescription(challengeData.description);
        setChallengePoints(challengeData.points);
        setChallengeStartDate(unix(challengeData.start));
        setChallengeEndDate(unix(challengeData.end));
      }
      setLoaded(true);
    });
  }, []);

  const dateErrorMessage = React.useMemo(() => {
    switch (dateError) {
      case "maxDate":
      case "minDate": {
        return "Le challenge peut pas se finir avant d'avoir commencé :/";
      }

      case "invalidDate": {
        return "C'est pas une date valide ça";
      }

      default: {
        return "";
      }
    }
  }, [dateError]);

  const theme = useTheme();
  const navigate = useNavigate();

  const updateChallenge = () => {
    if (!challengeName || !challengeDescription || !challengePoints) {
      setErrorMessage("Faut remplir tous les champs en fait");
      return;
    }
    if (!challengeStartDate) {
      setErrorMessage("Il faut une date de début");
      return;
    }
    if (!challengeEndDate) {
      setErrorMessage("Il faut une date de fin");
      return;
    }
    if (challengeStartDate!.isAfter(challengeEndDate!)) {
      setErrorMessage("La date de début est après la date de fin?????????");
    }
    setErrorMessage("");
    const challengeData: IChallengeUpdateData = {
      challenge: id!,
      points: challengePoints,
      end: challengeEndDate.unix(),
      description: challengeDescription,
      name: challengeName,
      start: challengeStartDate.unix(),
    };
    setLoadingButton(true);
    Api.apiCalls.UPDATE_CHALLENGE(challengeData).then((response) => {
      setLoadingButton(false);
      if (response.ok) {
        navigate("/challenges/" + id);
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
          error={challengeName == null && errorMessage != undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="Nom du challenge"
          value={challengeName ? challengeName : ""}
          onChange={(event) => setChallengeName(event.target.value)}
        />
        <TextField
          sx={{ maxWidth: "600px", width: "100%", m: 1, marginTop: 2 }}
          error={challengeDescription == null && errorMessage != undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="Description"
          value={challengeDescription ? challengeDescription : ""}
          onChange={(event) => setChallengeDescription(event.target.value)}
          rows={4}
          multiline
        />
        <TextField
          sx={{ maxWidth: "600px", width: "100%", m: 1, marginTop: 2 }}
          error={challengePoints == null && errorMessage != undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          type="number"
          label="Points"
          value={challengePoints ? challengePoints : 0}
          onChange={(event) => setChallengePoints(Number(event.target.value))}
        />
        <Box
          sx={{
            maxWidth: "600px",
            width: "100%",
            m: 1,
            marginTop: 2,
            display: "flex",
          }}
        >
          <DateTimePicker
            label="Début"
            ampm={false}
            sx={{ flex: 1, mr: 1 }}
            value={challengeStartDate}
            onChange={(newValue) => setChallengeStartDate(newValue)}
          />
          <DateTimePicker
            label="Fin"
            ampm={false}
            sx={{ flex: 1, ml: 1 }}
            value={challengeEndDate}
            onChange={(newValue) => setChallengeEndDate(newValue)}
            minDateTime={challengeStartDate}
            onError={(newError) => setDateError(newError)}
            slotProps={{
              textField: {
                helperText: dateErrorMessage,
              },
            }}
          />
        </Box>

        <LoadingButton
          onClick={() => updateChallenge()}
          loading={loadingButton}
        >
          Modifier le challenge
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

export default EditChallenge;
