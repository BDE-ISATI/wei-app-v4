import React from "react";
import {Fab} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ArrowBack} from "@mui/icons-material";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Fab
      color="primary"
      aria-label="back"
      sx={{
        position: "fixed",
        zIndex: (theme) => theme.zIndex.drawer,
        left: 16,
        bottom: 75,
        marginLeft: "auto",
        borderRadius: 0,
        border: "solid black",
      }}
      onClick={() => navigate(-1)}
    >
      <ArrowBack/>
    </Fab>
  );
};

export default BackButton;
