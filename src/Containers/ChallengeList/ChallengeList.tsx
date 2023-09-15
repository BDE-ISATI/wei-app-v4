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
  ToggleButton,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {useSelector} from "react-redux";
import {IState} from "../../Reducers";
import CardContent from "@mui/material/CardContent";
import {faArrowUpShortWide, faArrowDownWideShort} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FilterListIcon from '@mui/icons-material/FilterList';

var showFinished = true

const generateChallengeList = (challenges: IChallengeData[] | undefined,finishedChallenges:ImmutableArray<string>, searchValue: string, dateFilter: string[], sortDir: string, sortValue: string) => {
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
  }).filter((value) => {
    if (!finishedChallenges.includes(value.challenge) || showFinished )
      return true

    return false;
  })
  .sort((a, b) => {
    if (sortValue === "start") {
      if (sortDir === "asc")
        return a.start - b.start;
      else
        return b.start - a.start;
    } else if (sortValue === "end") {
      if (sortDir === "asc")
        return a.end - b.end;
      else
        return b.end - a.end;
    } else if (sortValue === "points") {
      if (sortDir === "asc")
        return a.points - b.points;
      else
        return b.points - a.points;
    }
    return 0;
  })
  .map((data, index) => (
    <div key={index}>
      <ChallengeCard challengeData={data}/>
    </div>
  ));
};

const ChallengeList = () => {
  const userDoneChallenge = useSelector(
    (state: IState) => state.user.challenges_done
  );
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [challengeList, setChallengeList] = React.useState<IChallengeData[] | undefined>();

  const [searchValue, setSearchValue] = React.useState<string>(searchParams.get("search")! || "");
  const [dateFilter, setDateFilter] = React.useState<string[]>(searchParams.getAll("date_filter").length !== 0 ? searchParams.getAll("date_filter") : ["active"]);
  const [sortValue, setSortValue] = React.useState<string>(searchParams.get("sort_value")! || "start");
  const [sortDirection, setSortDirection] = React.useState<string>(searchParams.get("sort")! || "asc");

console.log(searchParams)

  const isAdmin = useSelector((state: IState) => state.user.is_admin);

  const [ expanded, setExpanded ] = React.useState<boolean>(false);

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
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
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
          <CardContent sx={{
            ":last-child": {
              paddingBottom: "16px"
            },
          }}>
            <Accordion
              expanded={expanded}
              onChange={() => {}}
              onClick={() => {}}
              sx={{
              borderRadius: 0,
              border: "none",
              boxShadow: "none",
              "& .MuiAccordionSummary-root.Mui-expanded": {
                minHeight: "60px",
              },
            }}>
              <AccordionSummary
                expandIcon={<FilterListIcon sx={{margin: theme.spacing(2)}} onClick={() => setExpanded(!expanded)}/>}
                disableTouchRipple={true}
                sx={{
                  borderRadius: 0,
                  backgroundColor: theme.palette.background.default,
                  padding: 0,
                  minHeight: "60px",
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                  },
                  "& .MuiAccordionSummary-content.Mui-expanded": {
                    margin: 0,
                  },
                  "&.MuiAccordionSummary-gutters": {
                    backgroundColor: theme.palette.background.default,
                  },
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
                           value={searchValue}
                           onChange={(event) => {
                             setSearchValue(event.target.value);
                             let sp = searchParams;
                             if (event.target.value === "")
                               sp.delete("search");
                             else
                               sp.set("search", event.target.value);
                             setSearchParams(sp);
                           }}/>
              </AccordionSummary>
              <AccordionDetails sx={{
                borderRadius: 0,
                backgroundColor: theme.palette.background.default,
                borderBottom: "none",
                padding: 0
              }}>
                <ToggleButtonGroup value={dateFilter} onChange={(event, newFilter) => {
                  setDateFilter(newFilter);
                  let sp = searchParams;
                  sp.delete("date_filter");
                  newFilter.forEach((value: string) => {
                    sp.append("date_filter", value);
                  });
                  setSearchParams(sp);
                }}
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
                <ToggleButtonGroup value={dateFilter} onChange={(event) => {
                  let sp = searchParams;
                  showFinished = !showFinished
                  setSearchParams(sp);
                }}
                                   sx={{
                                     marginTop: theme.spacing(2),
                                     width: "100%",
                                     height: "60px"
                                   }}>
                    <ToggleButton value="finished" sx={{borderRadius: 0, width: "100%"}}>
                    Afficher les défis terminés
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
                    width: "80px",
                    height: "60px"
                  }} value={sortDirection} onChange={(event) => {
                    setSortDirection(event.target.value)
                    let sp = searchParams;
                    sp.set("sort", event.target.value);
                    setSearchParams(sp);
                  }}>
                    <MenuItem value={"asc"}><FontAwesomeIcon icon={faArrowUpShortWide} size="2x"/></MenuItem>
                    <MenuItem value={"desc"}><FontAwesomeIcon icon={faArrowDownWideShort} size="2x"/></MenuItem>
                  </Select>
                  <FormControl fullWidth>
                    <InputLabel id="tri-label">Trier par</InputLabel>
                    <Select label="Trier par"
                            labelId={"tri-label"}
                            defaultValue={""}
                            sx={{
                              borderRadius: 0,
                              width: "100%",
                              height: "60px"
                            }} value={sortValue} onChange={(event) => {
                      setSortValue(event.target.value)
                      let sp = searchParams;
                      sp.set("sort_value", event.target.value);
                      setSearchParams(sp);
                    }}>
                      <MenuItem value={"start"}>Date de début</MenuItem>
                      <MenuItem value={"end"}>Date de fin</MenuItem>
                      <MenuItem value={"points"}>Points</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
        {generateChallengeList(challengeList,userDoneChallenge, searchValue, dateFilter, sortDirection, sortValue)}
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
