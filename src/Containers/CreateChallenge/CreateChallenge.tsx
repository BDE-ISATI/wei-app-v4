import {
  Box,
  Button,
  useTheme,
  TextField,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { DateTimePicker, DateTimeValidationError } from "@mui/x-date-pickers";
import Api from "../../Services/Api";
import { ICreateChallengeData } from "../../Transforms/Challenge";
import { validIDRegex } from "../../Config/AppConfig";
import { BackButton } from "../../Components/BackButton";
import { LoadingButton } from "../../Components/LoadingButton";
import ImageCropPrompt from "../../Components/ImageCropPrompt/ImageCropPrompt";

function CreateChallenge() {
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [challengeName, setChallengeName] = useState<string | null>(null);
  const [challengeDescription, setChallengeDescription] = useState<
    string | null
  >(null);
  const [challengePoints, setChallengePoints] = useState<number | null>(null);
  const [challengeStartDate, setChallengeStartDate] = useState<Dayjs | null>(
    null
  );
  const [challengeEndDate, setChallengeEndDate] = useState<Dayjs | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [newChallengePic, setNewChallengePic] = useState<File | null>(null);
  const [newChallengePicPreview, setNewChallengePicPreview] = useState<
    string | undefined
  >(undefined);

  const [dateError, setDateError] =
    React.useState<DateTimeValidationError | null>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file != null) {
      setPreview(URL.createObjectURL(file));
      setOpen(true);
    }
    event.target.value = "";
  };

  const handleImageCreate = (croppedImage: File | undefined) => {
    setNewChallengePic(croppedImage!);
    setNewChallengePicPreview(URL.createObjectURL(croppedImage!));
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const createChallenge = async () => {
    setErrorMessage("");
    if (
      !challengeId ||
      !challengeName ||
      !challengeDescription ||
      !challengePoints
    ) {
      setErrorMessage("Faut remplir tous les champs en fait");
      return;
    }
    if (!validIDRegex.test(challengeId)) {
      setErrorMessage(
        "L'ID du challenge ne peux pas contenir de caractères spéciaux"
      );
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
    const challengeData: ICreateChallengeData = {
      challenge: challengeId,
      points: challengePoints,
      end: challengeEndDate.unix(),
      description: challengeDescription,
      name: challengeName,
      start: challengeStartDate.unix(),
    };
    setLoadingButton(true);
    if (newChallengePic) {
      let response = await Api.apiCalls.POST_PICTURE(newChallengePic, "banner");
      if (response.ok) {
        challengeData.picture_id = response.data?.id;
      }
    }
    Api.apiCalls.CREATE_CHALLENGE(challengeData).then((response) => {
      if (response.ok) {
        navigate("/challenges/" + challengeId);
      } else {
        setErrorMessage(response.data?.message);
      }
      setLoadingButton(false);
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
          width: "90vw",
          padding: "10px",
          flex: 1,
        }}
      >
        <TextField
          sx={{ maxWidth: "600px", width: "100%", m: 1, marginTop: 4 }}
          error={challengeId == null && errorMessage != undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="ID du challenge"
          value={challengeId}
          onChange={(event) => setChallengeId(event.target.value)}
          required
        />
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
          value={challengeName}
          onChange={(event) => setChallengeName(event.target.value)}
          required
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
          value={challengeDescription}
          onChange={(event) => setChallengeDescription(event.target.value)}
          rows={4}
          required
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
          value={challengePoints}
          required
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
            label="Début *"
            ampm={false}
            sx={{ flex: 1, mr: 1 }}
            value={challengeStartDate}
            onChange={(newValue) => setChallengeStartDate(newValue)}
          />
          <DateTimePicker
            label="Fin *"
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
        <Typography color="text.secondary" alignSelf={"flex-start"}>
          Image
        </Typography>
        <IconButton
          sx={{
            width: "100%",
            maxWidth: "100%",
            aspectRatio: "3/1",
            borderRadius: 0,
            overflow: "hidden",
            border: "solid 1px",
            borderColor: theme.palette.text.disabled,
          }}
          component="label"
        >
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileInput}
          />
          <img src={newChallengePicPreview} width="100%" height="100%" />
        </IconButton>

        <LoadingButton
          onClick={() => createChallenge()}
          loading={loadingButton}
        >
          Créer le challenge
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
      <ImageCropPrompt
        onClose={handleClose}
        open={open}
        image={preview}
        onImageCreate={handleImageCreate}
        title={""}
        aspectRatio={3 / 1}
        cropShape="rect"
      />
    </>
  );
}

export default CreateChallenge;
