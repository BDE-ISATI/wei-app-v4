import {Button, CircularProgress} from "@mui/material";
import React, {PropsWithChildren} from "react";

interface Props {
    onClick: () => void;
    color?:
        | "inherit"
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "info"
        | "warning";
    disabled?: boolean;
    loading?: boolean;
}

export const LoadingButton: React.FC<PropsWithChildren<Props>> = (props) => {
    return (
        <Button
            variant="contained"
            sx={{
                margin: 2,
                maxWidth: "600px",
                width: "90%",
                borderRadius: 0,
            }}
            color={props.color}
            disabled={props.loading || props.disabled}
            onClick={props.onClick}
        >
            {props.loading ? (
                <>
                    <CircularProgress
                        size={24}
                        sx={{
                            color: props.color,
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            marginTop: "-12px",
                            marginLeft: "-12px",
                        }}
                    />
                    {props.children}
                </>
            ) : (
                props.children
            )}
        </Button>
    );
};

export default LoadingButton;
