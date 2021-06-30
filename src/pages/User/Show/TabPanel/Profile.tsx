import React from "react";
import Box from "@material-ui/core/Box";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import LinkTable from "../../../../components/Table/Link";
import TwitterDialog from "../../../../components/Dialog/Twitter";
import { IUser, IUserLink, IUserType } from "../../../../interfaces";
import { patchUserLink } from "../../../../axios/axios";
import { selectHeaders } from "../../../../slices/currentUser";
import useQuerySnackbar from "../../../../hooks/useQuerySnackbar";
import queryKey from "../../../../constants/queryKey.json";
import userProfileQuery from "../../../../gql/query/user/profile";
import GraphQLClient from "../../../../gql/client";

const Post: React.FC = () => {
  const { onError } = useQuerySnackbar();
  // react-router-dom
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  // react-reduxs
  const headers = useSelector(selectHeaders);
  // react-query
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery([queryKey.USER, id, "Profile"], () =>
    GraphQLClient.request<IUserType>(userProfileQuery, { id }).then(
      (res) => res.user
    )
  );
  const user = queryClient.getQueryData<IUser>([queryKey.USER, id, "Profile"]);
  const onSuccess = (res: AxiosResponse<IUserLink>) => {
    queryClient.setQueryData<IUser | undefined>(
      [queryKey.USER, id, "Profile"],
      (prev) => prev && { ...prev, userLink: res.data }
    );
  };
  const userLinkMutation = useMutation(
    (twitterId: string) => patchUserLink(id, data?.link.id, twitterId, headers),
    { onSuccess, onError }
  );
  const handleSubmit = (value: string) => userLinkMutation.mutate(value);

  return (
    <>
      <Box my={3}>
        <LinkTable
          loading={isLoading}
          twitter={{
            link: data?.link.twitter,
            renderDialog(open, onClose) {
              return (
                <TwitterDialog
                  defaultValue={user?.link.twitter}
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
    </>
  );
};
export default Post;