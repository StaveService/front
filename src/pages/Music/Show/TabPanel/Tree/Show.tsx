import React from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";
import FileTable from "../../../../../components/Table/File";
import { useMusicTreeQuery } from "../../../../../reactQuery/query";

const Show: React.FC = () => {
  const params = useParams<{ userId: string; id: string }>();
  const match = useRouteMatch<{ id: string }>();
  const {
    state: { oid },
  } = useLocation<{ oid: string; path: string }>();
  const id = Number(params.id);
  const musicTree = useMusicTreeQuery({ id, oid });
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
