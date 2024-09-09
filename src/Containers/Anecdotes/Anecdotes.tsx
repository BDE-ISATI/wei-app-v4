import {
    Backdrop,
    Button,
    Card,
    CardHeader,
    CircularProgress,
    Container,
    MenuItem,
    Select,
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
            <CardHeader avatar={<UserAvatar user={reduceUserData(props.user)}/>} title={props.user.display_name}></CardHeader>

            <Select
                sx={{width:"100%"}}
                label="Anecdote"
                value={selected}
                onChange={(event)=>{setSelected(event.target.value as string);props.user.anecdoteSelected = (event.target.value as string)}}
            >
                    {anecdotes.map((data, index) => {
                        return <MenuItem value={data.anecdote}>{data.anecdote}</MenuItem>
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
        score += anecdote.anecdote===anecdote.anecdoteSelected ? 1 : 0
    }
    
    editedUser.scoreAnecdote = score

    Api.apiCalls.EDIT_SELF(editedUser).then((response) => {

    });
}

const ScoreBoard = () => {
    const [userList, setUserList] = useState<IUserData[] | undefined>();
    const navigate = useNavigate();
    const userData = useSelector((state: IState) => state.user);

    //const theme = useTheme();
    React.useEffect(() => {
        Api.apiCalls.GET_ALL_USERS().then((response) => {
            if (response.ok) {
                setUserList(response.data);
            }
        });
    }, []);
    if (userData.scoreAnecdote !== undefined) {
        return <div>
            <h1>score : {userData.scoreAnecdote}</h1>
        </div>
    }
    return (
        
        <div>
            <Container 
                sx={{
                    width: "500px",
                    maxWidth: "90vw",
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
            <Button onClick={() => sendResult().then(()=>{navigate("/scoreboard")})}>Soumettre</Button>

        </div>
    );
};

export default ScoreBoard;
