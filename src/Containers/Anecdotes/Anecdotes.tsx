import {
    Backdrop,
    Box,
    Button,
    Card,
    CardHeader,
    CircularProgress,
    Container,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Select,
    Typography,
    useTheme
} from "@mui/material";
import React, {useState} from "react";
import {UserAvatar} from "../../Components/UserAvatar";
import Api from "../../Services/Api";
import {IUserData, IUserUpdateData} from "../../Transforms";
import {reduceUserData} from "../../Transforms/User";
import {useNavigate} from "react-router-dom";
import { useSelector, useStore } from "react-redux";
import { IState } from "../../Reducers";

interface IUserListItem {
    user: IUserData;
    rank: number;
}

let anecdotes:IUserData[]

const AnecdoteListItem = (props: IUserListItem) => {
    const theme = useTheme();
    const navigate = useNavigate();

    let [selected,setSelected] = useState("")

    return (
        <Card

            sx={{
                color: theme.palette.getContrastText(theme.palette.background.default),
                bgcolor: "background.paper",
                boxShadow: `10px 10px 0px black`,
                border: "solid black",
            }}
        >
            <CardHeader title={props.user.anecdote}></CardHeader>

            <Select
                sx={{width:"100%"}}
                label="Anecdote"
                value={selected}
                onChange={(event)=>{setSelected(event.target.value as string);props.user.anecdoteSelected = (event.target.value as string)}}
            >
                    {anecdotes.map((data, index) => {
                        return <MenuItem value={data.username}>{data.display_name}</MenuItem>
                    })}
            </Select>
            
        </Card>
    );
};

const generateUserList = (users: IUserData[] | undefined) => {
    if (users === undefined) {
        return <></>;
    }

    anecdotes = users.filter((data, index) => {
        return data.anecdote;
    })

    return anecdotes.map((data, index) => (
        <div key={index}>
            <AnecdoteListItem user={data} rank={index}/>
        </div>
    ));
};

async function sendResult(){

    let score = 0

    var editedUser: IUserUpdateData = {};


    for (let anecdote of anecdotes){
        score += anecdote.username===anecdote.username ? 1 : 0
    }
    
    editedUser.scoreAnecdote = score

    await Api.apiCalls.EDIT_SELF(editedUser)
}

const UserListItem = (props: IUserListItem) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <ListItem
            sx={{
                color: theme.palette.getContrastText(theme.palette.background.default),
                cursor: "pointer"
            }}
            onClick={() => {
                navigate("/users/" + props.user.username)
            }}
        >
            <Typography sx={{marginRight: 2}}>{props.rank + 1}</Typography>
            <ListItemAvatar>
                <UserAvatar user={reduceUserData(props.user)}/>
            </ListItemAvatar>
            <ListItemText
                primary={props.user.display_name}
                secondary={
                    props.user.scoreAnecdote||0 + " point" + (props.user.scoreAnecdote||0 > 1 ? "s" : "")
                }
            />
        </ListItem>
    );
};

const generateUserList2 = (users: IUserData[] | undefined) => {
    if (users === undefined) {
        return <></>;
    }
    return users
        .sort((a: IUserData, b: IUserData) => {
            return (b.scoreAnecdote||0) - (a.scoreAnecdote||0);
        })
        .filter((data, index) => {
            return data.show;
        })
        .map((data, index) => (
            <div key={index}>
                <UserListItem user={data} rank={index}/>
                <Divider component="li"/>
            </div>
        ));
};

const ScoreBoard = () => {
    const [userList, setUserList] = useState<IUserData[] | undefined>();
    const navigate = useNavigate();
    const userDataStored = useSelector((state: IState) => state.user);


    const [userData, setUserData] = useState<IUserData | undefined>(undefined);



    //const theme = useTheme();
    React.useEffect(() => {
        Api.apiCalls.GET_ALL_USERS().then((response) => {
            if (response.ok) {
                setUserList(response.data);
                for (let item of response.data!){
                    if (item.username === userDataStored.username){
                        setUserData(item)
                    }
                }
            }
        });
    }, []);

    if (userData && userData.scoreAnecdote !== undefined) {
        return <div>
            <List
                sx={{
                    bgcolor: "background.paper",
                    boxShadow: `10px 10px 0px black`,
                    border: "solid black",
                    width: "500px",
                    maxWidth: "90vw",
                }}
            >
                {generateUserList2(userList)}
            </List>
        </div>
    }
    return (
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems:'center',
          gap:"2em"
        }}
      >
            <Container 
                sx={{
                    width: "500px",
                    maxWidth: "90vw",
                    gap:"2em",
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {generateUserList(userList)}
            </Container>
            <Backdrop
                sx={{color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={userList === undefined}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Button variant="contained" onClick={() => sendResult().then(()=>{navigate("/")})}>Soumettre</Button>


      </Box>
    );
};

export default ScoreBoard;
