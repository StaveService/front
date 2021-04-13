import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useSelector } from "react-redux";
import {
  Link as RouterLink,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Image from "material-ui-image";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import Grid from "@material-ui/core/Grid";
import InfoTabPanel from "./TabPanel/Info/Info";
import SettingTabPanel from "./TabPanel/Setting";
import IssuesTabPanel from "./TabPanel/Issue/Index";
import IssueNew from "./TabPanel/Issue/New";
import Issue from "./TabPanel/Issue/Show";
import Footer from "../../../components/Footer";
import MusicContext from "./context";
import { selectCurrentUser } from "../../../slices/currentUser";
import { IItunesMusic, IItunesResponse, IMusic } from "../../../interfaces";
import routes from "../../../router/routes.json";
import { itunes } from "../../../axios";

const Show: React.FC = () => {
  const [music, setMusic] = useState<IMusic>();
  const [itunesMusic, setItunesMusic] = useState<IItunesMusic>();
  const [loading, toggleLoading] = useToggle(false);
  const currentUser = useSelector(selectCurrentUser);
  const match = useRouteMatch<{ id: string; userId: string }>();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    toggleLoading();
    axios
      .get<IMusic>(match.url)
      .then((res) => setMusic(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  }, []);
  useEffect(() => {
    if (music)
      itunes
        .get<IItunesResponse<IItunesMusic>>("/lookup", {
          params: { id: music.itunes_track_id, entity: "song" },
        })
        .then((res) => setItunesMusic(res.data.results[0]))
        .catch((err) => enqueueSnackbar(String(err), { variant: "error" }));
  }, [music]);
  return (
    <MusicContext.Provider
      value={{ loading, music, itunesMusic, setMusic, setItunesMusic }}
    >
      <Container>
        <Grid container>
          <Grid item xs={8}>
            <Typography variant="h5">
              <MusicNoteIcon />
              {music?.title}
            </Typography>
          </Grid>
        </Grid>
        <Tabs
          value={
            location.pathname.includes("issues")
              ? match.url + routes.ISSUES
              : location.pathname
          }
        >
          <Tab
            label="Info"
            value={match.url}
            component={RouterLink}
            to={match.url}
          />
          <Tab
            label="Issues"
            value={match.url + routes.ISSUES}
            component={RouterLink}
            to={match.url + routes.ISSUES}
          />
          <Tab
            label="Setting"
            value={match.url + routes.SETTING}
            component={RouterLink}
            to={match.url + routes.SETTING}
            disabled={currentUser?.id !== Number(match.params.userId)}
          />
        </Tabs>
        <Box height="100px" width="100px" m="auto">
          <Image src={itunesMusic?.artworkUrl100 || "undefiend"} />
        </Box>
        <Switch>
          <Route exact path={match.path} component={InfoTabPanel} />
          <Route
            exact
            path={match.path + routes.SETTING}
            component={SettingTabPanel}
          />
          <Route
            exact
            path={match.path + routes.ISSUES}
            component={IssuesTabPanel}
          />
          <Route
            exact
            path={match.path + routes.ISSUES + routes.NEW}
            component={IssueNew}
          />
          <Route
            exact
            path={`${match.path}${routes.ISSUES}/:id`}
            component={Issue}
          />
        </Switch>
      </Container>
      <Footer src={itunesMusic?.previewUrl} />
    </MusicContext.Provider>
  );
};

export default Show;
