import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import DefaultLayout from "../../../layout/Default";
import UserTable from "../../../components/Table/User";
import queryKey from "../../../constants/queryKey.json";
import usePaginate from "../../../hooks/usePaginate";
import { getUserFollowing } from "../../../gql";

const Following: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const following = useQuery(
    [queryKey.USER, id, queryKey.MUSICS, page],
    getUserFollowing(id, page)
  );
  return (
    <DefaultLayout>
      <Typography variant="h5" color="initial">
        Following
      </Typography>
      <UserTable
        users={following.data?.data}
        loading={following.isLoading}
        page={page}
        pageCount={following.data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Following;
