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

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

function BasicCard() {
  const theme = useTheme();
  return (
    <Card
      variant="outlined"
      sx={{
        boxShadow: `10px 10px 0px black`,
        border: "solid black",
        width: "250px",
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
          NOM DU CHALLENGE
        </Typography>
      </CardContent>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          jusqu'au XX/XX
        </Typography>
        <Typography variant="body2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
          aut consequuntur soluta omnis ex amet reprehenderit veniam sapiente
          dolor quis, illo hic dolorum voluptatibus quibusdam, fuga cumque minus
          a itaque.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Box marginLeft={1}>
          <AvatarGroup total={24} max={4}>
            <Badge
              badgeContent={"👑"}
              overlap="circular"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </Badge>
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
            <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
          </AvatarGroup>
        </Box>
        <IconButton
          size="small"
          sx={{
            marginLeft: "auto",
            borderRadius: 0,
            backgroundColor: theme.palette.primary.main,
            border: "solid black",
          }}
        >
          <ArrowForwardIcon sx={{ color: "black" }} />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default BasicCard;
