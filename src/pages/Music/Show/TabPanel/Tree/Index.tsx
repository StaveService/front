import React from "react";
import { useQueryClient } from "react-query";
import { useRouteMatch } from "react-router-dom";
import FileTable from "../../../../../components/Table/File";
import baseURL from "../../../../../constants/baseURL";
import { IMusic } from "../../../../../interfaces";
import { useMusicRootTreeQuery } from "../../../../../reactQuery/query";
import { ShowProps } from "../../interface";

const Files: React.FC<ShowProps> = ({ queryKey }: ShowProps) => {
  const match = useRouteMatch<{ userId: string; id: string }>();
  const id = Number(match.params.id);
  const userId = Number(match.params.userId);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic | undefined>(queryKey);
  const musicTree = useMusicRootTreeQuery({ id });
  return (
    <div>
      <p>
        {baseURL}/git/{userId}/{music?.title}
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
