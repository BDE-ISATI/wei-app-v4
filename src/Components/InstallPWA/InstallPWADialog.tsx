import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";

interface Props {
  iosInstallPrompt: boolean;
  handleIOSInstallDeclined: () => void;
  webInstallPrompt: boolean;
  handleWebInstallDeclined: () => void;
  handleWebInstallAccepted: () => void;
}

const InstallPWADialog: React.FC<Props> = (props: Props) => {
  console.log(props);
  const theme = useTheme();
  return (
    <Dialog
      open
      sx={{
        "& .MuiDialog-paper": {
          boxShadow: `10px 10px 0px black`,
          border: "solid black",
          borderRadius: 0,
        },
      }}
    >
      <DialogTitle>Installer l'application?</DialogTitle>
      <DialogContent>
        <Box
          display={"flex"}
          width={"100%"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          maxWidth={"500px"}
        >
          <Typography color={"text.secondary"} mb={2}>
            Pour accéder plus rapidement aux défis et être le·a champion·ne de
            l'intégration 😎
          </Typography>
          {props.iosInstallPrompt && (
            <>
              <Typography
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                mb={1}
              >
                <IosShareIcon sx={{ mr: 1 }} /> puis "Ajouter à l'écran
                d'accueil"
              </Typography>
              <Button
                sx={{
                  marginLeft: "auto",
                  borderRadius: 0,
                  backgroundColor: theme.palette.error.light,
                  border: "solid black",
                  color: "black",
                  mr: 1,
                  textTransform: "none",
                }}
                onClick={props.handleIOSInstallDeclined}
              >
                Pas envie
              </Button>
            </>
          )}
          {props.webInstallPrompt && !props.iosInstallPrompt && (
            <Box>
              <Button
                sx={{
                  marginLeft: "auto",
                  borderRadius: 0,
                  backgroundColor: theme.palette.success.light,
                  border: "solid black",
                  color: "black",
                  mr: 1,
                  textTransform: "none",
                }}
                onClick={props.handleWebInstallAccepted}
              >
                Oui je veux
              </Button>
              <Button
                sx={{
                  marginLeft: "auto",
                  borderRadius: 0,
                  backgroundColor: theme.palette.error.light,
                  border: "solid black",
                  color: "black",
                  ml: 1,
                  textTransform: "none",
                }}
                onClick={props.handleWebInstallDeclined}
              >
                Nope
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InstallPWADialog;
