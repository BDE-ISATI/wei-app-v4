import React from "react";
import { Box, Typography, Card } from "@mui/material";

interface Props {
  title: string;
}

const TitleBar: React.FC<Props> = (props) => {
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          paddingTop: 1,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            //boxShadow: `10px 10px 0px black`,
            border: "solid black",
            width: "300px",
            height: "50px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          square
        >
          <Typography
            color="text.primary"
            sx={{ fontWeight: 800, fontSize: "24px" }}
          >
            {props.title}
          </Typography>
        </Card>
      </Box>
      <Box sx={{ height: "100px", width: "100vw" }} />
    </>
  );
};

export default TitleBar;
