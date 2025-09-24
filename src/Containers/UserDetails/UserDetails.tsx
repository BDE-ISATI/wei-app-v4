import React, {useState} from "react";
import {
    Backdrop,
    Box,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme
} from "@mui/material";
import {IChallengeData, IUserData} from "../../Transforms";
import {reduceUserData} from "../../Transforms/User";
import {useParams} from "react-router";
import Api from "../../Services/Api";
import {UserAvatar} from "../../Components/UserAvatar";
import {BackButton} from "../../Components/BackButton";

interface IChallengeDataListItem {
    challenge: IChallengeData;
}

const ChallengeListItem = (props: IChallengeDataListItem) => {
    const theme = useTheme();

    return (
        <ListItem
            sx={{
                color: theme.palette.getContrastText(theme.palette.background.default),
            }}
        >
            <ListItemText
                primary={props.challenge.name}
                secondary={
                    props.challenge.points + " point" + (props.challenge.points > 1 ? "s" : "")
                }
            />
        </ListItem>
    );
}

const generateChallengeList = (challenges: IChallengeData[] | undefined) => {
    if (challenges === undefined) {
        return <></>;
    }

    return challenges
        .sort((a: IChallengeData, b: IChallengeData) => {
            return b.points - a.points;
        })
        .map((data, index) => (
            <div key={index}>
                <ChallengeListItem challenge={data}/>
                <Divider component="li"/>
            </div>
        ));
}

const UserDetails = () => {
    const [userData, setUserData] = useState<IUserData | undefined>(undefined);
    const [challenges, setChallenges] = useState<IChallengeData[] | undefined>(undefined);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    const { username } = useParams();
    const theme = useTheme();

    React.useEffect(() => {
        const fetchData = async () => {
            const selfRes = await Api.apiCalls.GET_SELF();
            if (!selfRes.ok || !selfRes.data || !("is_admin" in selfRes.data) || !selfRes.data.is_admin) {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }

            const [userRes, challengesRes] = await Promise.all([
                Api.apiCalls.GET_USER(username!),
                Api.apiCalls.GET_ALL_CHALLENGES(),
            ]);

            if (userRes.ok) setUserData(userRes.data);
            if (challengesRes.ok) setChallenges(challengesRes.data);
        };

        fetchData();
    }, [username]);

    return (
        <>
            <BackButton />
            {userData && (
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        boxShadow: `10px 10px 0px black`,
                        border: "solid black",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "90vw",
                        flex: 1,
                    }}
                >
                    <UserAvatar
                        user={reduceUserData(userData!)}
                        width={150}
                        height={150}
                    />
                    <Typography
                        color={theme.palette.text.primary}
                        sx={{ fontWeight: 800, textAlign: "center" }}
                    >
                        {userData.display_name}
                    </Typography>
                    <Typography
                        color={theme.palette.text.secondary}
                        sx={{ fontWeight: 300, textAlign: "center" }}
                    >
                        {userData.username}
                    </Typography>

                    {isAdmin && (
                        <List
                            sx={{
                                width: "500px",
                                maxWidth: "90vw",
                                marginTop: 2,
                            }}
                        >
                            {generateChallengeList(
                                challenges?.filter((challenge) =>
                                    userData.challenges_done.includes(challenge.challenge)
                                )
                            )}
                            {userData.challenges_done.length === 0 && (
                                <Typography
                                    color={theme.palette.text.secondary}
                                    sx={{ fontWeight: 300, textAlign: "center" }}
                                >
                                    Cette personne n&apos;a pas encore réalisé de défis.
                                </Typography>
                            )}
                        </List>
                    )}
                </Box>
            )}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isAdmin === null || (userData === undefined && challenges === undefined)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};



export default UserDetails;
