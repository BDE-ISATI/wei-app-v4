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
  ToggleButton, Select,
  MenuItem, Accordion, AccordionSummary, AccordionDetails, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {IState} from "../../Reducers";
import CardContent from "@mui/material/CardContent";
import {faArrowUpShortWide, faArrowDownWideShort, faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ArrowDownward} from "@mui/icons-material";

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

    if (dateFilter.includes("active") && value.end > Date.now() / 1000 && value.start < Date.now() / 1000)
      return true;
    if (dateFilter.includes("upcoming") && value.start > Date.now() / 1000)
      return true;
    if (dateFilter.includes("finished") && value.end < Date.now() / 1000)
      return true;

    return false;
  }).sort((a, b) => {
    return (dateFilter.includes("upcoming") && dateFilter.length === 1) ? a.start - b.start : a.end - b.end;
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
            maxWidth: "90vw"
          }}
          square
        >
          <CardContent>
            <Accordion sx={{
              borderRadius: 0,
              border: "none",
              boxShadow: "none"
            }}>
              <AccordionSummary
                expandIcon={<ArrowDownward sx={{margin: theme.spacing(2)}}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  borderRadius: 0,
                  backgroundColor: theme.palette.background.default,
                  padding: 0,
                  margin: 0,
                }}>
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
              </AccordionSummary>
              <AccordionDetails sx={{
                borderRadius: 0,
                backgroundColor: theme.palette.background.default,
                borderBottom: "none",
                padding: 0
              }}>
                <ToggleButtonGroup value={dateFilter} onChange={(event, newFilter) => setDateFilter(newFilter)}
                                   sx={{
                                     marginTop: theme.spacing(2),
                                     width: "100%",
                                     height: "60px"
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
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    margin: 0,
                    marginTop: theme.spacing(2),
                  }}
                >
                  <Select sx={{
                    borderRadius: 0,
                    width: "100px",
                    height: "60px"
                  }}>
                    <MenuItem value={"asc"}><FontAwesomeIcon icon={faArrowUpShortWide} size="2x"/></MenuItem>
                    <MenuItem value={"desc"}><FontAwesomeIcon icon={faArrowDownWideShort} size="2x"/></MenuItem>
                  </Select>
                  <Select sx={{
                    borderRadius: 0,
                    width: "100%",
                    height: "60px"
                  }}>
                    <MenuItem value={"start"}>Début</MenuItem>
                    <MenuItem value={"end"}>Fin</MenuItem>
                  </Select>
                </Stack>
              </AccordionDetails>
            </Accordion>
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
