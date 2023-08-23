import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { IChallengeData } from "../../Transforms";
import Api from "../../Services/Api";
import { useParams } from "react-router";

const Challenge = () => {
  const [challengeData, setChallengeData] = React.useState<
    IChallengeData | undefined
  >();
  const theme = useTheme();
  const { id } = useParams();

  React.useEffect(() => {
    Api.apiCalls.GET_CHALLENGE(id!).then((response) => {
      if (response.ok) {
        setChallengeData(response.data);
      }
    });
  }, []);

  if (challengeData) {
    return (
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
        <Box
          style={{
            backgroundColor: `${theme.palette.secondary.main}`,
            width: "100%",
            borderBottom: "solid black",
          }}
        >
          <Typography
            color={theme.palette.getContrastText(theme.palette.primary.main)}
            sx={{ fontWeight: 800, textAlign: "center", margin: 2 }}
          >
            {challengeData.name}
            <br />
            {challengeData.points} point
            {challengeData.points > 1 ? "s" : ""}
          </Typography>
        </Box>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default Challenge;
