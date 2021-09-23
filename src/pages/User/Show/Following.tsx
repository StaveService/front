import React from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";
import DefaultLayout from "../../../layout/Default";
import UserTable from "../../../components/Table/User";
import usePaginate from "../../../hooks/usePaginate";
import { useUserFollowingQuery } from "../../../reactQuery/query";

const Following: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const following = useUserFollowingQuery({ id, page });
  return (
    <DefaultLayout>
      <Typography variant="h5" color="initial">
        <FormattedMessage id="following" />
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
