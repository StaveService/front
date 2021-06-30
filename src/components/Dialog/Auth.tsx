import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import TabPanel from "@material-ui/lab/TabPanel";
import Dialog from "@material-ui/core/Dialog";
import TabList from "@material-ui/lab/TabList";
import TabContext from "@material-ui/lab/TabContext";
import { useDispatch, useSelector } from "react-redux";
import SignInForm from "../Form/SignIn";
import SignUpForm from "../Form/SignUp";
import { close, selectOpened } from "../../slices/authModal";

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const opened = useSelector(selectOpened);
  const [value, setValue] = useState<"in" | "up">("up");
  const handleChange = (
    _event: React.ChangeEvent<Record<string, unknown>>,
    newValue: "in" | "up"
  ) => setValue(newValue);
  const handleClose = () => dispatch(close());
  return (
    <Dialog fullWidth open={opened} onClose={handleClose}>
      <TabContext value={value}>
        <Paper square>
          <TabList
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
            variant="fullWidth"
          >
            <Tab label="SignIn" value="in" />
            <Tab label="SignUp" value="up" />
          </TabList>
          <TabPanel value="in">
            <SignInForm onSuccess={handleClose} />
          </TabPanel>
          <TabPanel value="up">
            <SignUpForm onSuccess={handleClose} />
          </TabPanel>
        </Paper>
      </TabContext>
    </Dialog>
  );
};
export default Auth;
