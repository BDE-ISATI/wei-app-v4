import React from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {IUserData, IChallengeData} from "../../Transforms";
import Api from "../../Services/Api";
import {useTheme} from "@mui/material/styles";
import {UserAvatar} from "../../Components/UserAvatar";
import {reduceUserData, IUserSmallData} from "../../Transforms/User";
import {List, Link} from "@mui/material";
// import {useNavigate} from "react-router-dom";

interface INewsInfo {
  user: IUserSmallData;
  challenge: IChallengeData;
  time: number;
}

interface IAggregatedNewsInfo {
  user: IUserSmallData;
  challenges_display_name: string[];
  challenges_id: string[];
  points: number;
  rank_change: boolean;
  new_rank?: number;
}

interface INewsListItem {
  info: IAggregatedNewsInfo;
}

const NewsListItem = (props: INewsListItem) => {
  const theme = useTheme();

  // const navigate = useNavigate();

  return (
    <ListItem
      sx={{
        color: theme.palette.getContrastText(theme.palette.background.default),
      }}
    >
      <ListItemAvatar>
        <UserAvatar user={props.info.user}/>
      </ListItemAvatar>
      <ListItemText>
        {props.info.user.display_name + ` à réalisé pour ${props.info.points} points ` + (props.info.challenges_display_name.length > 1 ? "les défis " : "le défi ")}
        {props.info.challenges_display_name.map((dp, index) => <>{!!index && ", "}<Link
          href={"/challenges/" + props.info.challenges_id[index]}>{dp}</Link></>)}
      </ListItemText>
    </ListItem>
  );
};

const generateAggregatedNews = (users: IUserData[] | undefined, challenges: IChallengeData[] | undefined) => {
  if (challenges === undefined || users === undefined) {
    return undefined;
  }

  let challengesChrono: INewsInfo[] = [];

  for (let i = 0; i < users.length; i++) {
    let user = reduceUserData(users[i]);
    for (let j = 0; j < users[i].challenges_done.length; j++) {
      challengesChrono.push({
        user: user,
        challenge: challenges.find((challenge) => challenge.challenge === users[i].challenges_done[j])!,
        time: users[i].challenges_times[users[i].challenges_done[j]],
      });
    }
  }

  challengesChrono.sort((a, b) => {
    return b.time - a.time;
  })

  let aggregatedNews: IAggregatedNewsInfo[] = [];

  for (let i = 0; i < challengesChrono.length && aggregatedNews.length < 20; i++) {
    if (aggregatedNews.length > 1 && aggregatedNews[aggregatedNews.length - 1].user.username=== challengesChrono[i].user.username) {
      aggregatedNews[aggregatedNews.length - 1].challenges_display_name.push(challengesChrono[i].challenge.name);
      aggregatedNews[aggregatedNews.length - 1].challenges_id.push(challengesChrono[i].challenge.challenge);
      aggregatedNews[aggregatedNews.length - 1].points += challengesChrono[i].challenge.points;
    } else {
      aggregatedNews.push({
        user: challengesChrono[i].user,
        challenges_display_name: [challengesChrono[i].challenge.name],
        challenges_id: [challengesChrono[i].challenge.challenge],
        points: challengesChrono[i].challenge.points,
        rank_change: false,
      });
    }
  }

  return aggregatedNews;
}

const generateNewsList = (aggregatedNews: IAggregatedNewsInfo[] | undefined) => {
  if (aggregatedNews === undefined) {
    return <> </>;
  }
  return (
    <li>
      {aggregatedNews.map((newsInfo, index) => {
        return (
          <div>
            <NewsListItem info={newsInfo}/>
            <Divider component="li"/>
          </div>)
      })}
    </li>
  );
}

const NewsList = () => {
  const [list, setList] = React.useState<IAggregatedNewsInfo[] | undefined>(undefined);

  React.useEffect(() => {
    Promise.all([Api.apiCalls.GET_ALL_USERS(), Api.apiCalls.GET_ALL_CHALLENGES()]).then((res) => {
      if (res[0].ok && res[1].ok)
        setList(generateAggregatedNews(res[0].data, res[1].data));
    });
  }, []);

  return (
    <Box flex={1} position={"relative"}>
      <List
        sx={{
          bgcolor: "background.paper",
          boxShadow: `10px 10px 0px black`,
          border: "solid black",
          width: "500px",
          maxWidth: "90vw",
        }}
      >
        {generateNewsList(list)}
      </List>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={list === undefined}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
    </Box>
  );
};

export default NewsList;
