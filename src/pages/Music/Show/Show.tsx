import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import Image from "material-ui-image";
import InfoTabPanel from "./TabPanel/Info/Info";
import SettingTabPanel from "./TabPanel/Setting";
import IssuesTabPanel from "./TabPanel/Issues";
import MusicContext from "./context";
import Footer from "../../../components/Footer";
import { selectCurrentUser } from "../../../slices/currentUser";
import { IItunesMusic, IItunesResponse, IMusic } from "../../../interfaces";
import routes from "../../../router/routes.json";
import { itunes } from "../../../axios";

const Show: React.FC = () => {
  const [music, setMusic] = useState<IMusic>();
  const [itunesMusic, setItunesMusic] = useState<IItunesMusic>();
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState("1");
  const currentUser = useSelector(selectCurrentUser);
  const params = useParams<{ id: string; userId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (
    _event: React.ChangeEvent<Record<string, unknown>>,
    newValue: string
  ) => setTabIndex(newValue);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic>(
        `${routes.USERS}/${params.userId}${routes.MUSICS}/${params.id}`
      )
      .then((res) => setMusic(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (music)
      itunes
        .get<IItunesResponse<IItunesMusic>>("/lookup", {
          params: { id: music.itunes_track_id, entity: "song" },
        })
        .then((res) => setItunesMusic(res.data.results[0]))
        .catch((err) => console.log(err));
  }, [music]);
  return (
    <MusicContext.Provider value={{ music, setMusic }}>
      <Container>
        <Typography variant="h3">{music?.title}</Typography>
        <Box height="100px" width="100px" m="auto">
          <Image src={itunesMusic?.artworkUrl100 || "undefiend"} />
        </Box>
        <TabContext value={tabIndex}>
          <Paper square>
            <TabList onChange={handleChange}>
              <Tab label="Info" value="1" />
              <Tab label="Issues" value="2" />
              <Tab
                label="Setting"
                value="3"
                disabled={currentUser?.id !== Number(params.userId)}
              />
            </TabList>
          </Paper>
          <TabPanel value="1">
            <InfoTabPanel itunesMusic={itunesMusic} loading={loading} />
          </TabPanel>
          <TabPanel value="2">
            <IssuesTabPanel />
          </TabPanel>
          <TabPanel value="3">
            <SettingTabPanel />
          </TabPanel>
        </TabContext>
        <Footer src={itunesMusic?.previewUrl} />
      </Container>
    </MusicContext.Provider>
  );
};

export default Show;
