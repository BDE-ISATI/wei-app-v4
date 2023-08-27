import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Badge from "@mui/material/Badge";
import { IChallengeData, ITeamData } from "../../Transforms";
import { UserAvatarGroup } from "../UserAvatarGroup";
import { useNavigate } from "react-router-dom";

interface Props {
  teamData: ITeamData;
}

function TeamCard(props: Props) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleOpenButtonClick = () => {
    navigate(props.teamData.team);
  };
  return (
    <Card
      variant="outlined"
      sx={{
        boxShadow: `10px 10px 0px black`,
        border: "solid black",
        width: "500px",
        maxWidth: "90vw",
      }}
      square
    >
      <CardContent
        style={{
          backgroundColor: `${theme.palette.secondary.main}`,
          borderBottom: "solid black",
        }}
      >
        <Typography
          color={theme.palette.getContrastText(theme.palette.primary.main)}
          sx={{ fontWeight: 800, textAlign: "center" }}
        >
          {props.teamData.display_name}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary" align="center">
          {props.teamData.points} point{props.teamData.points > 1 ? "s" : ""}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Box marginLeft={1}>
          <UserAvatarGroup userData={props.teamData.members} max={5} />
        </Box>
        <IconButton
          size="small"
          sx={{
            marginLeft: "auto",
            borderRadius: 0,
            backgroundColor: theme.palette.primary.main,
            border: "solid black",
          }}
          onClick={handleOpenButtonClick}
        >
          <ArrowForwardIcon sx={{ color: "black" }} />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default TeamCard;
