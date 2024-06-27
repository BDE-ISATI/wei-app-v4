import React from "react";
import {Box, Card, CardActions, CardContent, IconButton, Typography, useTheme} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {IChallengeData} from "../../Transforms";
import {useNavigate} from "react-router-dom";
import {UserAvatarGroup} from "../UserAvatarGroup";
import {unix} from "dayjs";
import Api from "../../Services/Api";
import {IUserSmallData} from "../../Transforms/User";

interface Props {
    challengeData: IChallengeData;
}

function ChallengeCard(props: Props) {
    const theme = useTheme();
    const start = unix(props.challengeData.start).toDate();
    const end = unix(props.challengeData.end).toDate();
    const navigate = useNavigate();

    const handleOpenButtonClick = () => {
        navigate(props.challengeData.challenge);
    };
    var background: string | undefined = undefined;
    if (props.challengeData.picture_id && props.challengeData.picture_id !== "") {
        background = Api.apiCalls.GET_PICTURE_URL(props.challengeData.picture_id);
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
                    alt={props.challengeData.name}
                    src={background}
                    style={{
                        maxWidth: "100%",
                        width: "100%",
                        borderBottom: "solid black",
                        filter: `${
                            unix(Date.now() / 1000).toDate() < end &&
                            unix(Date.now() / 1000).toDate() > start
                                ? ""
                                : "grayscale(1)"
                        }`,
                    }}
                />
            ) : (
                <CardContent
                    style={{
                        backgroundColor: `${
                            unix(Date.now() / 1000).toDate() < end &&
                            unix(Date.now() / 1000).toDate() > start
                                ? theme.palette.secondary.main
                                : "gray"
                        }`,
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
                    {props.challengeData.name}
                    <br/>
                    {props.challengeData.points} point
                    {props.challengeData.points > 1 ? "s" : ""}
                </Typography>
                <Typography
                    sx={{mb: 1.5, alignSelf: "center", textAlign: "center"}}
                    color="text.secondary"
                >
                    Du{" "}
                    <b>
                        {unix(props.challengeData.start).toDate().toLocaleDateString("fr")}
                    </b>{" "}
                    au{" "}
                    <b>
                        {unix(props.challengeData.end).toDate().toLocaleDateString("fr")}
                    </b>
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Box marginLeft={1}>
                    <UserAvatarGroup
                        userData={props.challengeData.users.sort(
                            (a: IUserSmallData, b: IUserSmallData) => {
                                return a.time! - b.time!;
                            }
                        )}
                        max={5}
                        showCrown
                    />
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

export default ChallengeCard;
