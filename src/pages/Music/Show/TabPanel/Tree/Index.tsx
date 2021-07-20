import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useRouteMatch } from "react-router-dom";
import FileTable from "../../../../../components/Table/File";
import queryKey from "../../../../../constants/queryKey.json";
import { getMusicRootTree } from "../../../../../gql";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";
import { IMusic } from "../../../../../interfaces";

const Files: React.FC = () => {
  const { onError } = useQuerySnackbar();
  const match = useRouteMatch<{ userId: string; id: string }>();
  const id = Number(match.params.id);
  const userId = Number(match.params.userId);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic | undefined>([
    queryKey.MUSIC,
    id,
  ]);
  const musicTree = useQuery(
    [queryKey.MUSIC, id, queryKey.REPOSITORY],
    getMusicRootTree(id),
    {
      onError,
    }
  );
  return (
    <div>
      <p>
        http://localhost/git/{userId}/{music?.title}
        .git
      </p>
      <p>Files</p>
      <FileTable
        files={musicTree.data?.rootTree || []}
        treePath={`${match.url}/tree`}
        blobPath={`${match.url}/blob`}
      />
    </div>
  );
};
export default Files;
