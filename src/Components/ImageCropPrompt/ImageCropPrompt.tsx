import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  DialogActions,
  IconButton,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import getCroppedImg from "../../Utils/cropImage";

interface Props {
  onClose?: () => void;
  open: boolean;
  image?: string;
  onImageCreate: (image: File | undefined) => void;
  title: string;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
}

const ImageCropPrompt: React.FC<Props> = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const theme = useTheme();

  const onCropComplete = (
    croppedAreaPercentage: Area,
    croppedAreaPixels: Area
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCreateCroppedImage = async () => {
    const croppedImage = await getCroppedImg(props.image!, croppedArea!);
    props.onImageCreate(croppedImage);
  };
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      sx={{
        "& .MuiDialog-paper": {
          boxShadow: `10px 10px 0px black`,
          border: "solid black",
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Box
          style={{
            width: "50vh",
            maxWidth: "100%",
            aspectRatio: "1",
            position: "relative",
          }}
        >
          <Cropper
            image={props.image}
            crop={crop}
            zoom={zoom}
            aspect={props.aspectRatio || 1}
            maxZoom={5}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="cover"
            cropShape={props.cropShape || "round"}
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
          onClick={props.onClose}
        >
          <CloseIcon sx={{ color: "black" }} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropPrompt;
