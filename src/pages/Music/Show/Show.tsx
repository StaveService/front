import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import Image from "material-ui-image";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../slices/currentUser";
import InfoTabPanel from "./TabPanel/Info/Info";
import SettingTabPanel from "./TabPanel/Setting";
import IssuesTabPanel from "./TabPanel/Issues";
import {
  IItunesMusic,
  IItunesMusicsResponse,
  IMusic,
} from "../../../interfaces";
import routes from "../../../router/routes.json";
import { itunes } from "../../../axios";

const Show: React.FC = () => {
  const [music, setMusic] = useState<IMusic>();
  const [itunesMusic, setItunesMusic] = useState<IItunesMusic>();
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState("1");
  const currentUser = useSelector(selectCurrentUser);
  const params = useParams<{ id: string; userId: string }>();
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
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (music) {
      itunes
        .get<IItunesMusicsResponse>("/lookup", {
          params: { id: music.itunes_track_id, entity: "song" },
        })
        .then((res) => setItunesMusic(res.data.results[0]))
        .catch((err) => console.log(err));
    }
  }, [music]);
  return (
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
          <InfoTabPanel
            music={music}
            itunesMusic={itunesMusic}
            loading={loading}
          />
        </TabPanel>
        <TabPanel value="2">
          <IssuesTabPanel />
        </TabPanel>
        <TabPanel value="3">
          <SettingTabPanel />
        </TabPanel>
      </TabContext>
    </Container>
  );
};

export default Show;
