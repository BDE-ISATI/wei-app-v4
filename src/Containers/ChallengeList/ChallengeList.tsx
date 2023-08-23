import React from "react";
import Stack from "@mui/material/Stack";
import { ChallengeCard } from "../../Components/Card";
import { IChallengeData } from "../../Transforms";
import Api from "../../Services/Api";
import { Backdrop, CircularProgress } from "@mui/material";

const generateChallengeList = (challenges: IChallengeData[] | undefined) => {
  if (challenges === undefined) {
    return <></>;
  }
  return challenges.map((data, index) => (
    <div key={index}>
      <ChallengeCard challengeData={data} />
    </div>
  ));
};

const ChallengeList = () => {
  const [challengeList, setChallengeList] = React.useState<
    IChallengeData[] | undefined
  >();
  React.useEffect(() => {
    Api.apiCalls.GET_ALL_CHALLENGES().then((response) => {
      if (response.ok) {
        setChallengeList(response.data);
      }
    });
  }, []);
  return (
    <div>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {generateChallengeList(challengeList)}
      </Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={challengeList === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ChallengeList;
