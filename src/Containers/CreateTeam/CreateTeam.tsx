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
import { useNavigate } from "react-router-dom";
import { DateTimeValidationError } from "@mui/x-date-pickers";
import Api from "../../Services/Api";
import { ITeamUpdateData } from "../../Transforms";
import { validIDRegex } from "../../Config/AppConfig";
import { BackButton } from "../../Components/BackButton";
import { LoadingButton } from "../../Components/LoadingButton";
import ImageCropPrompt from "../../Components/ImageCropPrompt/ImageCropPrompt";

function CreateTeam() {
  const [teamId, setteamId] = useState<string | null>(null);
  const [teamName, setteamName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [newTeamPic, setNewTeamPic] = useState<File | null>(null);
  const [newTeamPicPreview, setNewTeamPicPreview] = useState<
    string | undefined
  >(undefined);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file !== null) {
      setPreview(URL.createObjectURL(file));
      setOpen(true);
    }
    event.target.value = "";
  };

  const handleImageCreate = (croppedImage: File | undefined) => {
    setNewTeamPic(croppedImage!);
    setNewTeamPicPreview(URL.createObjectURL(croppedImage!));
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const navigate = useNavigate();

  const createteam = async () => {
    setErrorMessage("");
    if (!teamId || !teamName) {
      setErrorMessage("Faut remplir tous les champs en fait");
      return;
    }
    if (!validIDRegex.test(teamId)) {
      setErrorMessage(
        "L'ID de l'équipe ne peux pas contenir de caractères spéciaux"
      );
      return;
    }
    const teamData: ITeamUpdateData = {
      team: teamId,
      display_name: teamName,
      picture_id: "",
    };
    setLoadingButton(true);
    if (newTeamPic) {
      let response = await Api.apiCalls.POST_PICTURE(newTeamPic, "banner");
      if (response.ok) {
        teamData.picture_id = response.data?.id;
      }
    }
    Api.apiCalls.CREATE_TEAM(teamData).then((response) => {
      setLoadingButton(false);
      if (response.ok) {
        navigate("/teams/" + teamId);
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
          width: "90vw",
          padding: "10px",
          flex: 1,
        }}
      >
        <TextField
          sx={{ maxWidth: "600px", width: "100%", m: 1, marginTop: 4 }}
          error={teamId=== null && errorMessage !== undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="ID de l'équipe"
          value={teamId}
          onChange={(event) => setteamId(event.target.value)}
          required
        />
        <TextField
          sx={{ maxWidth: "600px", width: "100%", m: 1, marginTop: 2 }}
          error={teamName=== null && errorMessage !== undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="Nom de l'équipe"
          value={teamName}
          onChange={(event) => setteamName(event.target.value)}
          required
        />
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
          <img src={newTeamPicPreview} width="100%" height="100%" />
        </IconButton>

        <LoadingButton onClick={() => createteam()} loading={loadingButton}>
          Créer l'équipe
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

export default CreateTeam;
