import React from "react";
import { FormattedMessage } from "react-intl";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { Box } from "@material-ui/core";
import ComposerAutocomplete from "./Autocomplete/Composer";
import LyristAutocomplete from "./Autocomplete/Lyrist";
import BandAutocomplete from "./Autocomplete/Band";
import useOpen from "../../../../../../../hooks/useOpen";

const Edit: React.FC = () => {
  const [open, handleOpen, handleClose] = useOpen();
  return (
    <>
      <Button onClick={handleOpen}>
        <FormattedMessage id="edit" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth>
        <Container>
          <Box mb={3}>
            <DialogTitle>
              <FormattedMessage id="editInfo" />
            </DialogTitle>
            <ComposerAutocomplete />
            <LyristAutocomplete />
            <BandAutocomplete />
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Edit;
