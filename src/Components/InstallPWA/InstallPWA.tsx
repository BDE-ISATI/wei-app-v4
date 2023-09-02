import React from "react";
import { useIosInstallPrompt } from "../../Hooks/IosInstallPrompt";
import { useWebInstallPrompt } from "../../Hooks/WebInstallPrompt";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";

const InstallPWA = () => {
  const [iosInstallPrompt, handleIOSInstallDeclined] = useIosInstallPrompt();
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] =
    useWebInstallPrompt();
  const theme = useTheme();

  if (!iosInstallPrompt && !webInstallPrompt) {
    return null;
  }
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
          {iosInstallPrompt && (
            <>
              <Typography
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <IosShareIcon sx={{ mr: 1 }} /> puis "Ajouter à l'écran
                d'accueil"
              </Typography>
            </>
          )}
          {webInstallPrompt && (
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
                onClick={handleWebInstallAccepted}
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
                onClick={handleWebInstallDeclined}
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

export default InstallPWA;
