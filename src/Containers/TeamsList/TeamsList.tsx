import React from "react";
import Stack from "@mui/material/Stack";
import { ITeamData } from "../../Transforms";
import Api from "../../Services/Api";
import TeamCard from "../../Components/Card/TeamCard";
import { Backdrop, CircularProgress, useTheme } from "@mui/material";

const generateTeamsList = (teams: ITeamData[] | undefined) => {
  if (teams === undefined) {
    return <></>;
  }
  return teams
    .sort((a: ITeamData, b: ITeamData) => {
      return b.points - a.points;
    })
    .map((data, index) => (
      <div key={index}>
        <TeamCard teamData={data} />
      </div>
    ));
};

const TeamsList = () => {
  const [teamsList, setTeamsList] = React.useState<ITeamData[] | undefined>();
  const theme = useTheme();
  React.useEffect(() => {
    Api.apiCalls.GET_ALL_TEAMS().then((response) => {
      if (response.ok) {
        setTeamsList(response.data);
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
        {generateTeamsList(teamsList)}
      </Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={teamsList === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default TeamsList;
