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
import InstallPWADialog from "./InstallPWADialog";

const InstallPWA = () => {
  const [iosInstallPrompt, handleIOSInstallDeclined] = useIosInstallPrompt();
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] =
    useWebInstallPrompt();
  const theme = useTheme();

  if (!iosInstallPrompt && !webInstallPrompt) {
    return null;
  }
  return (
    <InstallPWADialog
      iosInstallPrompt={iosInstallPrompt}
      handleIOSInstallDeclined={handleIOSInstallDeclined}
      webInstallPrompt={webInstallPrompt}
      handleWebInstallAccepted={handleWebInstallAccepted}
      handleWebInstallDeclined={handleWebInstallDeclined}
    />
  );
};

export default InstallPWA;
