import {
  Box,
  useTheme,
  TextField,
  Alert,
  Backdrop,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../Services/Api";
import { ITeamUpdateData } from "../../Transforms";
import { BackButton } from "../../Components/BackButton";
import { LoadingButton } from "../../Components/LoadingButton";
import ImageCropPrompt from "../../Components/ImageCropPrompt/ImageCropPrompt";

function EditTeam() {
  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamPictureId, setTeamPictureId] = useState<string | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const { id } = useParams();

  const theme = useTheme();
  const navigate = useNavigate();

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

  React.useEffect(() => {
    Api.apiCalls.GET_TEAM(id!).then((response) => {
      if (response.ok) {
        const teamData = response.data!;
        setTeamName(teamData.display_name);
        setTeamPictureId(teamData.picture_id);
      }
      setLoaded(true);
    });
  }, []);

  const updateTeam = async () => {
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
    if (newTeamPic) {
      let response = await Api.apiCalls.POST_PICTURE(newTeamPic, "banner");
      if (response.ok) {
        teamData.picture_id = response.data?.id;
      }
    }
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
          error={teamName=== null && errorMessage !== undefined}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="Nom de l'équipe"
          value={teamName ? teamName : ""}
          onChange={(event) => setTeamName(event.target.value)}
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
          <img
            src={
              newTeamPicPreview ||
              (teamPictureId && Api.apiCalls.GET_PICTURE_URL(teamPictureId))
            }
            width="100%"
            height="100%"
          />
        </IconButton>

        <LoadingButton onClick={() => updateTeam()} loading={loadingButton}>
          Modifier l'équipe
        </LoadingButton>
        {errorMessage && (
          <div>
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
          </div>
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
