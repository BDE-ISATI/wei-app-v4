import {Alert, Badge, FormControlLabel, FormGroup, IconButton, Switch, TextField, useTheme,} from "@mui/material";
import React, {useState} from "react";
import {UserAvatar} from "../../Components/UserAvatar";
import {IUserUpdateData, reduceUserData} from "../../Transforms/User";
import {useSelector} from "react-redux";
import {IState} from "../../Reducers";

import {Edit} from "@mui/icons-material";

import Api from "../../Services/Api";
import {useNavigate} from "react-router-dom";
import {BackButton} from "../../Components/BackButton";
import {LoadingButton} from "../../Components/LoadingButton";
import ImageCropPrompt from "../../Components/ImageCropPrompt/ImageCropPrompt";

function EditProfile() {
    const userData = useSelector((state: IState) => state.user);
    const [username, setUsername] = useState(userData.display_name);
    const [anecdote, setAnecdote] = useState(userData.anecdote);
    const [_profilePic, setProfilePic] = useState<File | null>(null);
    const [showUser, setShowUser] = useState<boolean>(userData.show);
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
    const [newProfilePicPreview, setNewProfilePicPreview] = useState<
        string | undefined
    >(undefined);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );
    const [open, setOpen] = useState<boolean>(false);
    const [loadingButton, setLoadingButton] = useState<boolean>(false);

    const theme = useTheme();
    const navigate = useNavigate();

    const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file !== null) {
            setPreview(URL.createObjectURL(file));
            setProfilePic(file);
            setOpen(true);
        }
        event.target.value = "";
    };

    const handleEditSelf = async () => {
        var editedUser: IUserUpdateData = {};
        setLoadingButton(true);
        if (newProfilePic) {
            let response = await Api.apiCalls.POST_PICTURE(newProfilePic);
            if (response.ok) {
                editedUser.picture_id = response.data?.id;
            }
        }
        if (username !== userData.display_name) {
            editedUser.display_name = username;
        }
        if (anecdote !== userData.anecdote) {
            editedUser.anecdote = anecdote;
        }
        if (showUser !== userData.show) {
            editedUser.show = showUser;
        }
        if (
            editedUser.display_name !== undefined ||
            editedUser.picture_id !== undefined ||
            editedUser.show !== undefined ||
            editedUser.anecdote !== undefined
        ) {
            Api.apiCalls.EDIT_SELF(editedUser).then((response) => {
                setLoadingButton(false);
                if (response.ok) {
                    navigate(-1);
                    setErrorMessage(undefined);
                    Api.apiCalls.GET_SELF();
                } else {
                    setErrorMessage(response.data?.message);
                }
            });
        } else {
            setLoadingButton(false);
        }
    };

    const handleImageCreate = (croppedImage: File | undefined) => {
        setNewProfilePic(croppedImage!);
        setNewProfilePicPreview(URL.createObjectURL(croppedImage!));
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <BackButton/>
            <FormGroup
                sx={{
                    bgcolor: "background.paper",
                    boxShadow: `10px 10px 0px black`,
                    border: "solid black",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "90vw",
                    flex: 1,
                }}
            >
                <IconButton component="label">
                    <Badge
                        badgeContent={<Edit/>}
                        color="primary"
                        overlap="circular"
                        sx={{
                            "& .MuiBadge-badge": {
                                fontSize: 16,
                                height: 48,
                                minWidth: 48,
                                borderRadius: 48,
                                border: "solid",
                                borderColor: theme.palette.background.paper,
                            },
                        }}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                    >
                        <UserAvatar
                            imageURL={newProfilePicPreview}
                            user={reduceUserData(userData)}
                            width={150}
                            height={150}
                        />
                    </Badge>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileInput}
                    />
                </IconButton>
                <TextField
                    sx={{maxWidth: "300px", width: "100%", m: 1, marginTop: 4}}
                    InputProps={{
                        sx: {
                            borderRadius: 0,
                            backgroundColor: theme.palette.background.paper,
                        },
                    }}
                    label="Nom affiché"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <TextField
                    sx={{maxWidth: "300px", width: "100%", m: 1, marginTop: 4}}
                    InputProps={{
                        sx: {
                            borderRadius: 0,
                            backgroundColor: theme.palette.background.paper,
                        },
                    }}
                    label="Anecdote"
                    rows={4}
                    value={anecdote}
                    onChange={(event) => setAnecdote(event.target.value)}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={showUser}
                            onChange={(event) => setShowUser(event.target.checked)}
                        />
                    }
                    style={{
                        color: showUser
                            ? theme.palette.text.primary
                            : theme.palette.text.disabled,
                    }}
                    label="Afficher sur le classement"
                />
                <LoadingButton onClick={handleEditSelf} loading={loadingButton}>
                    Appliquer
                </LoadingButton>
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
            </FormGroup>
            <ImageCropPrompt
                onClose={handleClose}
                open={open}
                image={preview}
                onImageCreate={handleImageCreate}
                title={"C'est bien ta tête ça?"}
            />
        </>
    );
}

export default EditProfile;
