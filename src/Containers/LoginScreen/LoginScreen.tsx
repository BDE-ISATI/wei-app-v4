import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  useTheme,
} from "@mui/material";
import React from "react";
import Api from "../../Services/Api";
import { useDispatch } from "react-redux";
import { AuthActions } from "../../Reducers/Auth";

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

function LoginScreen() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    Api.apiCalls.USER_LOGIN({ username, password }).then((response) => {
      dispatch(
        AuthActions.loginSuccess({
          accessToken: response?.AccessToken,
          expiresAt: response?.ExpiresIn.toString(),
          idToken: response?.IdToken,
          refreshToken: response?.RefreshToken,
        })
      );
    });
  };
  return (
    <>
      <TextField
        sx={{ width: "25ch", m: 1 }}
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

      <FormControl sx={{ width: "25ch", m: 1 }} variant="outlined">
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
      <Button
        variant="contained"
        sx={{ marginTop: 5, width: "25ch", borderRadius: 0 }}
        onClick={handleLogin}
      >
        Se connecter
      </Button>
    </>
  );
}

export default LoginScreen;
