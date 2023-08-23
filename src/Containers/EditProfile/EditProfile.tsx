import {
  Box,
  Modal,
  IconButton,
  Button,
  useTheme,
  TextField,
  Badge,
  Slide,
  CardContent,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import { UserAvatar } from "../../Components/UserAvatar";
import { IUserUpdateData, reduceUserData } from "../../Transforms/User";
import { useSelector } from "react-redux";
import { IState } from "../../Reducers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPencil } from "@fortawesome/free-solid-svg-icons";
import { TransitionProps } from "@mui/material/transitions";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Api from "../../Services/Api";
import { useNavigation } from "react-router-dom";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import getCroppedImg from "../../Utils/cropImage";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function getModalStyle() {
  const top = 25;
  const left = 25;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function EditProfile() {
  const userData = useSelector((state: IState) => state.user);
  const [username, setUsername] = useState(userData.display_name);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [newProfilePicPreview, setNewProfilePicPreview] = useState<
    string | undefined
  >(undefined);

  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const theme = useTheme();
  const navigate = useNavigation();

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file != null) {
      setPreview(URL.createObjectURL(file));
      setProfilePic(file);
      setOpen(true);
    }
    event.target.value = "";
  };

  const handleEditSelf = async () => {
    var editedUser: IUserUpdateData = {};
    if (newProfilePic) {
      console.log(newProfilePic);
      let response = await Api.apiCalls.POST_PICTURE(newProfilePic);
      if (response.ok) {
        editedUser.picture_id = response.data?.id;
      }
    }
    if (username != userData.display_name) {
      editedUser.display_name = username;
    }
    if (
      editedUser.display_name != undefined ||
      editedUser.picture_id != undefined
    ) {
      Api.apiCalls.EDIT_SELF(editedUser).then((response) => {
        if (response.ok) {
          alert("C fait!");
        } else {
          alert(response.data?.message);
        }
      });
    }
  };

  const onCropComplete = (
    croppedAreaPercentage: Area,
    croppedAreaPixels: Area
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCreateCroppedImage = async () => {
    const croppedImage = await getCroppedImg(preview!, croppedArea!);
    setNewProfilePic(croppedImage!);
    setNewProfilePicPreview(URL.createObjectURL(croppedImage!));
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
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
          flex: 1,
        }}
      >
        <IconButton component="label">
          <Badge
            badgeContent={<FontAwesomeIcon icon={faPencil} />}
            color="primary"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: 16,
                height: 48,
                minWidth: 48,
                borderRadius: 48,
                border: "solid",
                borderColor: theme.palette.background.paper,
              },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <UserAvatar
              imageURL={newProfilePicPreview}
              user={reduceUserData(userData)}
              width={150}
              height={150}
            />
          </Badge>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileInput}
          />
        </IconButton>
        <TextField
          sx={{ maxWidth: "300px", width: "100%", m: 1, marginTop: 4 }}
          InputProps={{
            sx: {
              borderRadius: 0,
              backgroundColor: theme.palette.background.paper,
            },
          }}
          label="Nom d'utilisateur"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Button
          variant="contained"
          sx={{
            marginTop: 5,
            maxWidth: "300px",
            width: "100%",
            borderRadius: 0,
          }}
          onClick={handleEditSelf}
        >
          Appliquer
        </Button>
      </Box>
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{
          "& .MuiDialog-paper": {
            boxShadow: `10px 10px 0px black`,
            border: "solid black",
            borderRadius: 0,
          },
        }}
      >
        <DialogTitle>C'est bien ça ta tête?</DialogTitle>
        <DialogContent>
          <Box
            style={{
              width: "50vh",
              height: "50vh",
              maxWidth: "75vw",
              maxHeight: "75vw",
              position: "relative",
            }}
          >
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              maxZoom={5}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="cover"
              cropShape="round"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton
            size="small"
            sx={{
              marginLeft: "auto",
              borderRadius: 0,
              backgroundColor: theme.palette.success.light,
              border: "solid black",
            }}
            onClick={handleCreateCroppedImage}
          >
            <CheckIcon sx={{ color: "black" }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              marginLeft: "auto",
              borderRadius: 0,
              backgroundColor: theme.palette.error.light,
              border: "solid black",
            }}
            onClick={handleClose}
          >
            <CloseIcon sx={{ color: "black" }} />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditProfile;
