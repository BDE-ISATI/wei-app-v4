import React from "react";
import {Box, Card, CardActions, CardContent, IconButton, Typography, useTheme} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {ITeamData} from "../../Transforms";
import {UserAvatarGroup} from "../UserAvatarGroup";
import {useNavigate} from "react-router-dom";
import Api from "../../Services/Api";
import {yaUnS} from "../../Utils/yaUnS";

interface Props {
    teamData: ITeamData;
}

function TeamCard(props: Props) {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleOpenButtonClick = () => {
        navigate(props.teamData.team);
    };
    var background: string | undefined = undefined;
    if (props.teamData.picture_id && props.teamData.picture_id !== "") {
        background = Api.apiCalls.GET_PICTURE_URL(props.teamData.picture_id);
    }
    return (
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
            {background ? (
                <img
                    alt={props.teamData.display_name}
                    src={background}
                    style={{
                        maxWidth: "100%",
                        width: "100%",
                        borderBottom: "solid black",
                    }}
                />
            ) : (
                <CardContent
                    style={{
                        backgroundColor: `${theme.palette.secondary.main}`,
                        borderBottom: "solid black",
                    }}
                />
            )}

            <CardContent sx={{display: "flex", flexDirection: "column"}}>
                <Typography
                    color="text.primary"
                    sx={{
                        alignSelf: "center",
                        textAlign: "center",
                        fontWeight: 800,
                        marginBottom: 1,
                        wordBreak: "break-word",
                    }}
                >
                    {props.teamData.display_name}
                    <br/>
                    {props.teamData.points} point
                    {yaUnS(props.teamData.points)}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Box marginLeft={1}>
                    <UserAvatarGroup userData={props.teamData.members} max={5}/>
                </Box>
                <IconButton
                    size="small"
                    sx={{
                        marginLeft: "auto",
                        borderRadius: 0,
                        backgroundColor: theme.palette.primary.main,
                        border: "solid black",
                    }}
                    onClick={handleOpenButtonClick}
                >
                    <ArrowForwardIcon sx={{color: "black"}}/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default TeamCard;
