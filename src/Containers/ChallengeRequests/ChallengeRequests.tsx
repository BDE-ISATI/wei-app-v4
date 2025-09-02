import {
    Backdrop,
    Badge,
    CircularProgress,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    useTheme
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { UserAvatar } from "../../Components/UserAvatar";
import Api from "../../Services/Api";
import { IChallengeData, IUserData } from "../../Transforms";
import { reduceUserData } from "../../Transforms/User";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../Components/BackButton";
import { yaUnS } from "../../Utils/yaUnS";

import { Check as CheckIcon, Close as CloseIcon, ExpandLess, ExpandMore } from "@mui/icons-material";

interface IUserListItem {
    user: IUserData;
    challenges: IChallengeData[];
}

const ChallengeListItem = (props: {
    data: IChallengeData | undefined;
    user: IUserData;
}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const validateChallenge = () => {
        if (!props.data) return;
        
        Api.apiCalls
            .ACCEPT_CHALLENGE_REQUEST(props.user.username, props.data.challenge)
            .then(() => {
                navigate(0);
            })
            .catch(error => {
                console.error("Error validating challenge:", error);
            });
    };

    const denyChallenge = () => {
        if (!props.data) return;
        
        Api.apiCalls
            .ACCEPT_CHALLENGE_REQUEST(
                props.user.username,
                props.data.challenge,
                true
            )
            .then(() => {
                navigate(0);
            })
            .catch(error => {
                console.error("Error denying challenge:", error);
            });
    };

    // If data is undefined, don't render anything
    if (!props.data) {
        return null;
    }

    return (
        <>
            <Divider component="li"/>
            <ListItem
                secondaryAction={
                    <>
                        <IconButton
                            size="small"
                            sx={{
                                marginLeft: "auto",
                                borderRadius: 0,
                                backgroundColor: theme.palette.success.light,
                                border: "solid black",
                            }}
                            onClick={validateChallenge}
                        >
                            <CheckIcon sx={{color: "black"}}/>
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                marginLeft: 1,
                                borderRadius: 0,
                                backgroundColor: theme.palette.error.light,
                                border: "solid black",
                            }}
                            onClick={denyChallenge}
                        >
                            <CloseIcon sx={{color: "black"}}/>
                        </IconButton>
                    </>
                }
            >
                <ListItemButton
                    sx={{pl: 4, color: theme.palette.text.primary, marginRight: 8}}
                    onClick={() => {
                        // Extra null check for TypeScript
                        if (props.data && props.data.challenge) {
                            navigate("/challenges/" + props.data.challenge);
                        }
                    }}
                >
                    <ListItemText
                        primary={props.data.name || ""}
                        secondary={
                            (props.data.points || 0) + " point" + yaUnS(props.data.points || 0)
                        }
                    />
                </ListItemButton>
            </ListItem>
        </>
    );
};

const generateChallengeList = (
    challenges: string[] | undefined,
    challengesData: IChallengeData[],
    user: IUserData
) => {
    if (!challenges || !challenges.length) {
        return null;
    }

    return challenges.map((data: string, index: number) => (
        <React.Fragment key={`challenge-${data}-${index}`}>
            <ChallengeListItem
                data={challengesData.find(
                    (challenge) => challenge.challenge === data
                )}
                user={user}
            />
        </React.Fragment>
    ));
};

const UserListItem = (props: IUserListItem) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton
                onClick={handleClick}
                sx={{
                    color: theme.palette.getContrastText(
                        theme.palette.background.default
                    ),
                }}
            >
                <ListItemAvatar>
                    <Badge
                        badgeContent={props.user.challenges_pending?.length || 0}
                        color="primary"
                        max={9}
                        overlap="circular"
                    >
                        <UserAvatar user={reduceUserData(props.user)}/>
                    </Badge>
                </ListItemAvatar>

                <ListItemText
                    primary={props.user.display_name || props.user.username || "User"}
                    secondary={props.user.mail || ""}
                />
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {generateChallengeList(
                        props.user.challenges_pending,
                        props.challenges,
                        props.user
                    )}
                </List>
            </Collapse>
        </>
    );
};

const NoPendingValidation = () => {
    const theme = useTheme();
    return (
        <ListItem>
            <ListItemText sx={{pl: 4, color: theme.palette.text.primary}}>
                Aucune demande de validation.
            </ListItemText>
        </ListItem>
    );
};

const generateUserList = (
    users: IUserData[] | undefined,
    challenges: IChallengeData[] | undefined
) => {
    if (!users || !challenges) {
        return null;
    }

    // Add null check for challenges_pending
    const userWithPendingChallenges = users.filter(
        (user) => user.challenges_pending && user.challenges_pending.length > 0
    );
    
    if (userWithPendingChallenges.length === 0) {
        return <NoPendingValidation/>;
    }
    
    return userWithPendingChallenges
        .sort((a: IUserData, b: IUserData) => {
            // Add null checks for sort
            const aLength = a.challenges_pending?.length || 0;
            const bLength = b.challenges_pending?.length || 0;
            return bLength - aLength;
        })
        .map((data, index) => (
            <React.Fragment key={`user-${data.username || index}`}>
                <UserListItem user={data} challenges={challenges}/>
                <Divider component="li"/>
            </React.Fragment>
        ));
};

const ChallengeRequest = () => {
    // Initialize with empty arrays to prevent undefined errors
    const [userList, setUserList] = useState<IUserData[]>([]);
    const [challengesList, setChallengesList] = useState<IChallengeData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const usersResponse = await Api.apiCalls.GET_ALL_USERS(true);
                if (usersResponse.ok) {
                    setUserList(usersResponse.data || []);
                }
                
                // Fetch challenges
                const challengesResponse = await Api.apiCalls.GET_ALL_CHALLENGES();
                if (challengesResponse.ok) {
                    setChallengesList(challengesResponse.data || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    return (
        <div>
            <BackButton/>
            <List
                sx={{
                    bgcolor: "background.paper",
                    boxShadow: `10px 10px 0px black`,
                    border: "solid black",
                    width: "500px",
                    maxWidth: "90vw",
                }}
            >
                {generateUserList(userList, challengesList)}
            </List>
            <Backdrop
                sx={{color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
    );
};

export default ChallengeRequest;