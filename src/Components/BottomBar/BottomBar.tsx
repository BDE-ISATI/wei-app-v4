import React from "react";
import {AccountCircle, EmojiEvents, Group, Newspaper, Star} from "@mui/icons-material";
import {BottomNavigation, BottomNavigationAction, Paper, useTheme} from "@mui/material";
import {Link} from "react-router-dom";

const BottomBar = () => {
    const pathname = window.location.pathname;
    const [value, setValue] = React.useState(pathname);

    const onChange = (
        event: React.SyntheticEvent<Element, Event>,
        newValue: any
    ) => {
        setValue(newValue);
    };

    const theme = useTheme();

    return (
        <>
            <Paper
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: (theme) => theme.zIndex.drawer + 2,
                }}
                elevation={3}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={onChange}
                    sx={{
                        borderTop: "solid black",
                        color: theme.palette.secondary.main,
                        paddingLeft: 3,
                        paddingRight: 3,
                        "&  .Mui-selected > svg": {
                            color: theme.palette.secondary.main,
                        },
                        background: theme.palette.action.disabledOpacity,
                        "& .MuiButtonBase-root": {
                            margin: 0,
                            padding: 0,
                            minWidth: "70px"
                        },
                    }}
                >
                    <BottomNavigationAction
                        component={Link}
                        to="/"
                        value={"/"}
                        icon={<Newspaper fontSize="medium" htmlColor={theme.palette.text.primary}/>}
                    />
                    <BottomNavigationAction
                        component={Link}
                        to="/challenges"
                        value={"/challenges"}

                        icon={<Star fontSize="medium" htmlColor={theme.palette.text.primary}/>}
                    />

                    /*<BottomNavigationAction
                        component={Link}
                        to="/scoreboard"
                        value={"/scoreboard"}
                        icon={<EmojiEvents fontSize="medium" htmlColor={theme.palette.text.primary}/>}
                    />*/
                    <BottomNavigationAction
                        component={Link}
                        to="/teams"
                        value={"/teams"}
                        icon={<Group fontSize="medium" htmlColor={theme.palette.text.primary}/>}
                    />
                    <BottomNavigationAction
                        component={Link}
                        to="/account"
                        value={"/account"}
                        icon={<AccountCircle fontSize="medium" htmlColor={theme.palette.text.primary}/>}
                    />
                </BottomNavigation>
            </Paper>
            <BottomNavigation/>
        </>
    );
};

export default BottomBar;
