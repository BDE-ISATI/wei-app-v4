import React from "react";
import Stack from "@mui/material/Stack";
import { BasicCard } from "../../Components/Card";

const ChallengeList = () => {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <BasicCard />
      <BasicCard />
      <BasicCard />
    </Stack>
  );
};

export default ChallengeList;
