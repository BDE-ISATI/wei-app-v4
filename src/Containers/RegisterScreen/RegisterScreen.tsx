import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  useTheme,
} from "@mui/material";
import React from "react";
import Api from "../../Services/Api";
import { useDispatch } from "react-redux";
import { AuthActions } from "../../Reducers/Auth";
import { UserActions } from "../../Reducers/User";
import { PasswordInput } from "../../Components/PasswordInput";

/**
 * Api.apiCalls.USER_LOGIN().then((response) => {
        dispatch(
          AuthActions.loginSuccess({
            accessToken: response?.AccessToken,
            expiresAt: response?.ExpiresIn.toString(),
            idToken: response?.IdToken,
            refreshToken: response?.RefreshToken,
          })
        );
      });
 * 
 */

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
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = () => {
    Api.apiCalls
      .USER_REGISTER({ username, password, email })
      .then((response) => {
        if (response.ok) {
          console.log("Authentification réussie!");
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
    </>
  );
}

export default RegisterScreen;
