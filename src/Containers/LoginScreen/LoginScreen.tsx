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
import React, { useState } from "react";
import Api from "../../Services/Api";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions, loggedIn } from "../../Reducers/Auth";
import { UserActions } from "../../Reducers/User";
import { useNavigate } from "react-router-dom";
import { IState } from "../../Reducers";
import { LoadingButton } from "../../Components/LoadingButton";

function LoginScreen() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<String | undefined>(
    undefined
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLoggedIn = useSelector((state: IState) => loggedIn(state.auth));
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  React.useEffect(() => {
    if (userLoggedIn) {
      navigate("/account");
    }
  }, [userLoggedIn]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    setLoadingButton(true);
    const response = await Api.apiCalls.USER_LOGIN({ username, password });
    setLoadingButton(false);
    if (!response.ok) {
      setErrorMessage(response.data?.message);
    }
  };

  return (
    <div>
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
      <LoadingButton onClick={handleLogin} loading={loadingButton}>
        Se connecter
      </LoadingButton>
      <Link sx={{ m: 1 }} href="/register">
        Je n'ai pas de compte
      </Link>
    </div>
  );
}

export default LoginScreen;
