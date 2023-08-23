import React from "react";
import Stack from "@mui/material/Stack";
import { ChallengeCard } from "../../Components/Card";
import { IChallengeData } from "../../Transforms";
import Api from "../../Services/Api";
import { Backdrop, Box, CircularProgress, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IState } from "../../Reducers";

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
  const isAdmin = useSelector((state: IState) => state.user.is_admin);
  const navigate = useNavigate();

  React.useEffect(() => {
    Api.apiCalls.GET_ALL_CHALLENGES().then((response) => {
      if (response.ok) {
        setChallengeList(response.data);
      }
    });
  }, []);
  return (
    <Box flex={1} position={"relative"}>
      {isAdmin && (
        <Fab
          color="warning"
          aria-label="add"
          sx={{
            position: "fixed",
            zIndex: (theme) => theme.zIndex.drawer,
            right: 16,
          }}
          onClick={() => navigate("/create/challenge")}
        >
          <AddIcon />
        </Fab>
      )}
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        {generateChallengeList(challengeList)}
      </Stack>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={challengeList === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ChallengeList;
