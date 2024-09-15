import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Link,
    Slide,
    TextField,
    useTheme,
} from "@mui/material";
import React from "react";
import Api from "../../Services/Api";
import {useSelector} from "react-redux";
import {loggedIn} from "../../Reducers/Auth";
import {PasswordInput} from "../../Components/PasswordInput";
import {TransitionProps} from "@mui/material/transitions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {useNavigate} from "react-router-dom";
import {IState} from "../../Reducers";
import {validIDRegex} from "../../Config/AppConfig";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ResetPasswordScreen() {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");
    const [passwordCheck, setPasswordCheck] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState<String | undefined>(
        undefined
    );
    const [openDialogue, setOpenDialogue] = React.useState(false);

    const navigate = useNavigate();
    const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));

    React.useEffect(() => {
        if (userLoggedIn) {
            navigate("/account");
        }
    }, []);

    const handleClose = () => {
        setOpenDialogue(false);
        navigate("/login");
    };

    const handleLogin = () => {
        setErrorMessage("");
        if (!validIDRegex.test(username)) {
            setErrorMessage(
                "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux"
            );
            return;
        }

        Api.apiCalls
            .USER_RESET_PASSWORD({username, password, code})
            .then((response) => {
                if (response.ok) {
                    setOpenDialogue(true);
                } else {
                    setErrorMessage(response.data!.message);
                }
            });
    };
    return (
        <>
            <TextField
                sx={{maxWidth: "300px", width: "100%", m: 1}}
                InputProps={{
                    sx: {
                        borderRadius: 0,
                        backgroundColor: theme.palette.background.paper,
                    },
                }}
                label="Nom d'utilisateur"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
            <TextField
                sx={{maxWidth: "300px", width: "100%", m: 1}}
                InputProps={{
                    sx: {
                        borderRadius: 0,
                        backgroundColor: theme.palette.background.paper,
                    },
                }}
                label="Code de vérification"
                value={code}
                onChange={(event) => setCode(event.target.value)}
            />
            <PasswordInput
                password={password}
                onChange={setPassword}
                onShowPassword={() => {
                    setShowPassword(!showPassword);
                }}
                showPassword={showPassword}
                label={"Mot de passe"}
            />
            <PasswordInput
                password={passwordCheck}
                onChange={setPasswordCheck}
                onShowPassword={() => {
                    setShowPassword(!showPassword);
                }}
                showPassword={showPassword}
                label={"Confirmer le mot de passe"}
            />
            {errorMessage && (
                <div>
                    <Alert
                        variant="outlined"
                        severity="error"
                        sx={{
                            marginTop: 1,
                            borderRadius: 0,
                        }}
                    >
                        {errorMessage}
                    </Alert>
                </div>
            )}
            <Button
                variant="contained"
                sx={{marginTop: 5, maxWidth: "300px", width: "100%", borderRadius: 0}}
                onClick={handleLogin}
            >
                Envoyer
            </Button>

            <Dialog
                open={openDialogue}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                    style: {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `10px 10px 0px black`,
                        border: "solid black",
                    },
                }}
            >
                <DialogTitle>Modification de mot de passe envoyé</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Ton mot de passe a normalement été modifié 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <IconButton
                        size="small"
                        sx={{
                            marginLeft: "auto",
                            borderRadius: 0,
                            backgroundColor: theme.palette.primary.main,
                            border: "solid black",
                        }}
                        onClick={handleClose}
                    >
                        <ArrowForwardIcon sx={{color: "black"}}/>
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ResetPasswordScreen;
