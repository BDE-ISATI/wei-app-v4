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
import { useDispatch, useSelector } from "react-redux";
import { AuthActions, loggedIn } from "../../Reducers/Auth";
import { UserActions } from "../../Reducers/User";
import { useNavigate } from "react-router-dom";
import { IState } from "../../Reducers";

function LoginScreen() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [inccorectCreds, setIncorrectCreds] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));

  React.useEffect(() => {
    if (userLoggedIn) {
      navigate("/account");
    }
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    Api.apiCalls.USER_LOGIN({ username, password }).then((response) => {
      if (response.ok) {
        dispatch(
          AuthActions.loginSuccess({
            accessToken: response.data?.AuthenticationResult.AccessToken,
            expiresAt: response.data?.AuthenticationResult.ExpiresIn.toString(),
            idToken: response.data?.AuthenticationResult.IdToken,
            refreshToken: response.data?.AuthenticationResult.RefreshToken,
          })
        );
        Api.apiCalls.GET_SELF().then((response) => {
          if (response.ok) {
            dispatch(UserActions.setUserData(response.data));
          }
        });
        navigate("/account");
      } else {
        setIncorrectCreds(true);
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

      <FormControl
        sx={{ maxWidth: "300px", width: "100%", m: 1 }}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password">
          Mot de passe
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          sx={{
            borderRadius: 0,
            backgroundColor: theme.palette.background.paper,
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormControl>
      {inccorectCreds && (
        <Alert
          variant="outlined"
          severity="error"
          sx={{
            marginTop: 1,
            borderRadius: 0,
          }}
        >
          Nom d'utilisateur ou mot de passe incorrect
        </Alert>
      )}
      <Button
        variant="contained"
        sx={{ marginTop: 5, maxWidth: "300px", width: "100%", borderRadius: 0 }}
        onClick={handleLogin}
      >
        Se connecter
      </Button>
      <Link sx={{ m: 1 }} href="/register">
        Je n'ai pas de compte
      </Link>
    </>
  );
}

export default LoginScreen;
