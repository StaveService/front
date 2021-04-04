import React, { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AutocompleteTextField from "../../../../../../components/AutocompleteTextField";
import ControlSelect from "../../../../../../components/ControlSelect";
import LoadingButton from "../../../../../../components/Loading/LoadingButton";
import ControlTextField from "../../../../../../components/ControlTextField";
import routes from "../../../../../../router/routes.json";
import MusicContext from "../../../context";
import { IArtist, IRole } from "../../../../../../interfaces";
import { addRoleSchema } from "../../../../../../schema";

const Role: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { music, setMusic } = useContext(MusicContext);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue } = useForm<IRole>({
    defaultValues: { artist_id: undefined },
    resolver: yupResolver(addRoleSchema),
  });
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleSelectOption = (option: IArtist) =>
    setValue("artist_id", option.id);
  const handleRemoveOption = () => setValue("artist_id", "");

  const onSubmit = (data: SubmitHandler<IRole>) => console.log(data);
  return (
    <>
      <Button onClick={handleOpen}>Edit</Button>
      <Dialog onClose={handleClose} open={open} fullWidth>
        <DialogTitle>Role</DialogTitle>
        <Container>
          <Box mb={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Artist</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {music?.roles?.map((role) => {
                    const handleClick = () => {
                      console.log(role);
                    };
                    return (
                      <TableRow key={role.id}>
                        <TableCell>
                          <Link component={RouterLink} to="/">
                            {role.role}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            component={RouterLink}
                            to={`${routes.ARTISTS}/${role.artist.id}`}
                          >
                            {role.artist.name}
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={handleClick}>
                            <CloseIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <ControlTextField
            defaultValue=""
            type="hidden"
            control={control}
            name="artist_id"
          />
          <Box mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <ControlSelect
                  defaultValue={0}
                  control={control}
                  name="role"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value={0}>Vocal</MenuItem>
                  <MenuItem value={1}>Guitar</MenuItem>
                  <MenuItem value={2}>Base</MenuItem>
                  <MenuItem value={3}>Drum</MenuItem>
                </ControlSelect>
              </Grid>
              <Grid item xs={9}>
                <AutocompleteTextField
                  searchRoute={routes.ARTISTS}
                  property="name"
                  query="cont"
                  onSelectOption={handleSelectOption}
                  onRemoveOption={handleRemoveOption}
                  textFieldProps={{
                    label: "Composers",
                    variant: "outlined",
                  }}
                  autocompleteProps={{ multiple: true }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mb={3}>
            <LoadingButton loading={loading} onClick={handleSubmit(onSubmit)}>
              Add Artist
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Role;
