import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
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
import Button from "@material-ui/core/Button";
import InfoTabPanel from "./TabPanel/Info";
import SettingTabPanel from "./TabPanel/Setting";
import IssuesTabPanel from "./TabPanel/Issue/Index";
import IssueNew from "./TabPanel/Issue/New";
import Issue from "./TabPanel/Issue/Show";
import Footer from "../../../components/Footer";
import { selectCurrentUser } from "../../../slices/currentUser";
import { IItunesMusic, IItunesResponse, IMusic } from "../../../interfaces";
import routes from "../../../router/routes.json";
import { itunes } from "../../../axios";

const Show: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const match = useRouteMatch<{ id: string; userId: string }>();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const music = useQuery<IMusic>(
    ["musics", match.params.id],
    () => axios.get<IMusic>(match.url).then((res) => res.data),
    { onError }
  );
  const itunesMusic = useQuery<IItunesMusic>(
    ["itunesMusics", music.data?.itunes_track_id],
    () =>
      itunes
        .get<IItunesResponse<IItunesMusic>>("/lookup", {
          params: { id: music.data?.itunes_track_id, entity: "song" },
        })
        .then((res) => res.data.results[0]),
    { enabled: !!music.data?.itunes_track_id, onError }
  );
  return (
    <>
      <Container>
        <Grid container>
          <Grid item xs={8}>
            <Typography variant="h5">
              <MusicNoteIcon />
              {music.data?.title}
            </Typography>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to={match.url + routes.TAB}
          fullWidth
        >
          Watch Tab
        </Button>
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
          <Image src={itunesMusic?.data?.artworkUrl100 || "undefiend"} />
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
      <Footer src={itunesMusic?.data?.previewUrl} />
    </>
  );
};
export default Show;
