import React from "react";
import Box from "@material-ui/core/Box";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import MusicTable from "../../../../components/Table/Music";
import LinkTable from "../../../../components/Table/Link";
import TwitterDialog from "../../../../components/Dialog/Twitter";
import {
  IIndexType,
  IMusic,
  IUserLink,
  IUserType,
} from "../../../../interfaces";
import { patchUserLink } from "../../../../axios/axios";
import { selectHeaders } from "../../../../slices/currentUser";
import { useQuerySnackbar } from "../../../../hooks/useQuerySnackbar";
import queryKey from "../../../../constants/queryKey.json";

interface RootProps {
  musics: IIndexType<IMusic> | undefined;
  userLink: IUserLink | undefined;
  loading: boolean;
  page: number;
  onPage: (event: React.ChangeEvent<unknown>, value: number) => void;
}
const Post: React.FC<RootProps> = ({
  musics,
  userLink,
  loading,
  page,
  onPage,
}: RootProps) => {
  const { onError } = useQuerySnackbar();
  // react-router-dom
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  // react-reduxs
  const headers = useSelector(selectHeaders);
  // react-query
  const queryClient = useQueryClient();
  const onSuccess = (res: AxiosResponse<IUserLink>) => {
    queryClient.setQueryData<IUserType | undefined>(
      [queryKey.USERS, id],
      (prev) => prev && { ...prev, userLink: res.data }
    );
  };
  const userLinkMutation = useMutation(
    (twitterId: string) => patchUserLink(id, userLink?.id, twitterId, headers),
    { onSuccess, onError }
  );
  const handleSubmit = (value: string) => userLinkMutation.mutate(value);

  return (
    <>
      <Box my={3}>
        <LinkTable
          twitter={{
            link: userLink?.twitter,
            renderDialog(open, onClose) {
              return (
                <TwitterDialog
                  open={open}
                  loading={userLinkMutation.isLoading}
                  onClose={onClose}
                  onPatch={handleSubmit}
                />
              );
            },
          }}
        />
      </Box>
      <MusicTable
        musics={musics?.data}
        loading={loading}
        pageCount={musics?.pagination.totalPages}
        page={page}
        onPage={onPage}
      />
    </>
  );
};
export default Post;