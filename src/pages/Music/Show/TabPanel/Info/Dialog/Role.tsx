import axios, { AxiosResponse } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useSnackbar } from "notistack";
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
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import AutocompleteTextField from "../../../../../../components/AutocompleteTextField";
import ControlSelect from "../../../../../../components/ControlSelect";
import LoadingButton from "../../../../../../components/Loading/LoadingButton";
import ControlTextField from "../../../../../../components/ControlTextField";
import routes from "../../../../../../router/routes.json";
import { IArtist, IMusic, IRole } from "../../../../../../interfaces";
import { addRoleSchema } from "../../../../../../schema";
import {
  selectHeaders,
  setHeaders,
} from "../../../../../../slices/currentUser";
import { useOpen } from "../../../../../../common/useOpen";

const Role: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit, setValue } = useForm<IRole>({
    defaultValues: { artist_id: undefined },
    resolver: yupResolver(addRoleSchema),
  });
  const match = useRouteMatch<{ id: string }>();
  const route = match.url + routes.ROLES;
  const headers = useSelector(selectHeaders);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(["musics", match.params.id]);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const handleSelectOption = (option: IArtist) =>
    setValue("artist_id", option.id);
  const handleRemoveOption = () => setValue("artist_id", "");
  const handleCreateSuccess = (res: AxiosResponse<IRole>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      ["musics", match.params.id],
      (prev) =>
        prev && {
          ...prev,
          roles: [...(prev.roles || []), res.data],
        }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse<IRole>, role: IRole) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      ["musics", match.params.id],
      (prev) =>
        prev && {
          ...prev,
          roles:
            prev.roles && prev.roles.filter((prevRole) => prevRole !== role),
        }
    );
  };
  const onError = (err: unknown) => {
    enqueueSnackbar(String(err), { variant: "error" });
  };
  const createRoleMutation = useMutation(
    (newRole: IRole) => axios.post<IRole>(route, newRole, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyRoleMutation = useMutation(
    (role: IRole) => axios.delete<IRole>(`${route}/${role.id}`, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
  const onSubmit = (data: IRole) => createRoleMutation.mutate(data);
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
                    const handleClick = () => destroyRoleMutation.mutate(role);
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
                  <MenuItem value={4}>Vocal&Guitar</MenuItem>
                  <MenuItem value={5}>Vocal&Base</MenuItem>
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
            <LoadingButton
              color="primary"
              loading={createRoleMutation.isLoading}
              onClick={handleSubmit(onSubmit)}
              fullWidth
            >
              Add Artist
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Role;
