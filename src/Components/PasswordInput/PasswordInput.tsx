import {Visibility, VisibilityOff} from "@mui/icons-material";
import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, useTheme,} from "@mui/material";
import React from "react";

interface Props {
    password: String;
    onChange: (newPassword: string) => void;
    showPassword: boolean;
    onShowPassword: () => void;
    label: String;
}

const PasswordInput: React.FC<Props> = (props) => {
    const theme = useTheme();

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    return (
        <FormControl
            sx={{maxWidth: "300px", width: "100%", m: 1}}
            variant="outlined"
        >
            <InputLabel htmlFor="outlined-adornment-password">
                {props.label}
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={props.showPassword ? "text" : "password"}
                sx={{
                    borderRadius: 0,
                    backgroundColor: theme.palette.background.paper,
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={props.onShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {props.showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                }
                label={props.label}
                value={props.password}
                onChange={(event) => props.onChange(event.target.value)}
            />
        </FormControl>
    );
};

export default PasswordInput;
