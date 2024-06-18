import React from "react";
import {ITeamData} from "../../Transforms";
import Api from "../../Services/Api";
import TeamCard from "../../Components/Card/TeamCard";
import {Backdrop, Box, CircularProgress, Fab, Stack} from "@mui/material";
import {useSelector} from "react-redux";
import {IState} from "../../Reducers";
import {useNavigate} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

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
                <TeamCard teamData={data}/>
            </div>
        ));
};

const TeamsList = () => {
    const [teamsList, setTeamsList] = React.useState<ITeamData[] | undefined>();
    // const theme = useTheme();
    const isAdmin = useSelector((state: IState) => state.user.is_admin);
    const navigate = useNavigate();

    React.useEffect(() => {
        Api.apiCalls.GET_ALL_TEAMS().then((response) => {
            if (response.ok) {
                setTeamsList(response.data);
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
                        left: 16,
                        bottom: 75,
                        marginLeft: "auto",
                        borderRadius: 0,
                        border: "solid black",
                    }}
                    onClick={() => navigate("/create/team")}
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
                {generateTeamsList(teamsList)}
            </Stack>
            <Backdrop
                sx={{color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={teamsList === undefined}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Box>
    );
};

export default TeamsList;
