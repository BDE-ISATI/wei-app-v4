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
import { useSelector } from "react-redux";
import { loggedIn } from "../../Reducers/Auth";
import { PasswordInput } from "../../Components/PasswordInput";
import { TransitionProps } from "@mui/material/transitions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { IState } from "../../Reducers";
import { validIDRegex } from "../../Config/AppConfig";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function RegisterScreen() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
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
      .USER_REGISTER({ username, password, email })
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
        sx={{ maxWidth: "300px", width: "100%", m: 1 }}
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
        sx={{ maxWidth: "300px", width: "100%", m: 1 }}
        InputProps={{
          sx: {
            borderRadius: 0,
            backgroundColor: theme.palette.background.paper,
          },
        }}
        label="Adresse e-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
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
        sx={{ marginTop: 5, maxWidth: "300px", width: "100%", borderRadius: 0 }}
        onClick={handleLogin}
      >
        S'inscrire
      </Button>
      <Link sx={{ m: 1 }} href="/login">
        J'ai déjà un compte
      </Link>

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
        <DialogTitle>{"On t'a envoyé un mail de confirmation 🤙"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Va voir ta boite{" "}
            <b style={{ color: theme.palette.text.primary }}>{email}</b> pour
            finir ton inscription 🔥🔥🔥
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
            <ArrowForwardIcon sx={{ color: "black" }} />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RegisterScreen;
