import SvgIcon from "@material-ui/core/SvgIcon";
// import { Theme } from "@material-ui/core/styles";
// import createStyles from "@material-ui/core/styles/createStyles";
// import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { FaSpotify } from "react-icons/fa";

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     colorPrimary: {
//       color: theme.palette.spotify.main,
//     },
//   })
// );
const Itunes: React.FC = () => {
  // const classes = useStyles();
  return (
    <SvgIcon
    // classes={{ root: classes.colorPrimary }}
    >
      <FaSpotify size={24} />
    </SvgIcon>
  );
};
export default Itunes;
