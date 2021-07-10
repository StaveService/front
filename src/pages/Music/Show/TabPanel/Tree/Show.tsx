import React from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import FileTable from "../../../../../components/Table/File";
import { getMusicTree } from "../../../../../gql";
import queryKey from "../../../../../constants/queryKey.json";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";

const Show: React.FC = () => {
  const { onError } = useQuerySnackbar();
  const params = useParams<{ userId: string; id: string }>();
  const match = useRouteMatch<{ id: string }>();
  const {
    state: { oid },
  } = useLocation<{ oid: string; path: string }>();
  const id = Number(params.id);
  const musicTree = useQuery(
    [queryKey.MUSIC, id, queryKey.BLOB],
    getMusicTree(id, oid),
    {
      onError,
    }
  );
  return (
    <div>
      <pre>{musicTree.data?.blob}</pre>
      <FileTable
        files={musicTree.data?.tree || []}
        treePath={match.url.replace("tree", "blob")}
        blobPath={match.url.replace("tree", "blob")}
      />
    </div>
  );
};
export default Show;
