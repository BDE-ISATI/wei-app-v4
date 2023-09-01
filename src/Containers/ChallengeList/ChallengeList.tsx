import React from "react";
import Stack from "@mui/material/Stack";
import {ChallengeCard} from "../../Components/Card";
import {IChallengeData} from "../../Transforms";
import Api from "../../Services/Api";
import {
  Backdrop,
  Box,
  CircularProgress,
  Fab,
  Card,
  TextField,
  useTheme,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {IState} from "../../Reducers";
import CardContent from "@mui/material/CardContent";

const generateChallengeList = (challenges: IChallengeData[] | undefined, searchValue: string, dateFilter: string[]) => {
  if (challenges === undefined) {
    return <></>;
  }

  return challenges.filter((value) => {
    return searchValue === "" ||
      value.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      value.description.toLowerCase().includes(searchValue.toLowerCase()) ||
      value.challenge.toLowerCase().includes(searchValue.toLowerCase()) ||
      value.users.filter((user) => user.username.toLowerCase().includes(searchValue.toLowerCase())).length > 0;
  }).filter((value) => {
    if (dateFilter.length === 0)
      return true;

    if (dateFilter.includes("active") && value.end > Date.now()/1000 && value.start < Date.now()/1000)
      return true;
    if (dateFilter.includes("upcoming") && value.start > Date.now()/1000)
      return true;
    if (dateFilter.includes("finished") && value.end < Date.now()/1000)
      return true;

    return false;
  }).sort((a, b) => {
    return a.end - b.end;
  }).map((data, index) => (
    <div key={index}>
      <ChallengeCard challengeData={data}/>
    </div>
  ));
};

const ChallengeList = () => {
  const [challengeList, setChallengeList] = React.useState<
    IChallengeData[] | undefined
  >();
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [dateFilter, setDateFilter] = React.useState<string[]>(["active"]);
  const isAdmin = useSelector((state: IState) => state.user.is_admin);
  const navigate = useNavigate();

  React.useEffect(() => {
    Api.apiCalls.GET_ALL_CHALLENGES().then((response) => {
      if (response.ok) {
        setChallengeList(response.data);
      }
    });
  }, []);

  const theme = useTheme();

  return (
    <Box flex={1} position={"relative"}>
      {isAdmin && (
        <Fab
          color="warning"
          aria-label="add"
          sx={{
            position: "fixed",
            zIndex: (theme) => theme.zIndex.drawer,
            left: 16,
            bottom: 75,
            marginLeft: "auto",
            borderRadius: 0,
            border: "solid black",
          }}
          onClick={() => navigate("/create/challenge")}
        >
          <AddIcon/>
        </Fab>
      )}
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Card
          variant="outlined"
          sx={{
            boxShadow: `10px 10px 0px black`,
            border: "solid black",
            width: "500px",
            maxWidth: "90vw",
          }}
          square
        >
          <CardContent>
            <TextField id="outlined-basic" label="Rechercher" variant="outlined"
                       sx={{
                         width: "100%",
                       }}
                       InputProps={{
                         sx: {
                           borderRadius: 0,
                         }
                       }}
                       onChange={(event) => setSearchValue(event.target.value)}/>
            <ToggleButtonGroup value={dateFilter} onChange={(event, newFilter) => setDateFilter(newFilter)}
                               sx={{
                                 width: "100%",
                                 marginTop: 2,
                               }}>
              <ToggleButton value="active" sx={{borderRadius: 0, width: "100%"}}>
                Actifs
              </ToggleButton>
              <ToggleButton value="upcoming" sx={{borderRadius: 0, width: "100%"}}>
                À venir
              </ToggleButton>
              <ToggleButton value="finished" sx={{borderRadius: 0, width: "100%"}}>
                Terminés
              </ToggleButton>
            </ToggleButtonGroup>
          </CardContent>
        </Card>
        {generateChallengeList(challengeList, searchValue, dateFilter)}
      </Stack>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={challengeList === undefined}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
    </Box>
  );
};

export default ChallengeList;
