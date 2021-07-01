import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import DefaultLayout from "../../../layout/Default";
import UserTable from "../../../components/Table/User";
import queryKey from "../../../constants/queryKey.json";
import { IUserType } from "../../../interfaces";
import usePaginate from "../../../hooks/usePaginate";
import GraphQLClient from "../../../gql/client";
import userFollowerQuery from "../../../gql/query/user/followers";

const Follower: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const followers = useQuery([queryKey.USER, id, queryKey.MUSICS, page], () =>
    GraphQLClient.request<IUserType>(userFollowerQuery, {
      id,
      followerPage: page,
    }).then((res) => res.user.followers)
  );
  return (
    <DefaultLayout>
      <Typography variant="h5" color="initial">
        Followers
      </Typography>
      <UserTable data={followers.data?.data} onPage={handlePage} />
    </DefaultLayout>
  );
};
export default Follower;
