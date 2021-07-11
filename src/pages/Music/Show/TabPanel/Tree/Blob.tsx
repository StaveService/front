import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import SyntaxHighlighter from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Paper from "@material-ui/core/Paper";
import { getMusicBlob } from "../../../../../gql";
import queryKey from "../../../../../constants/queryKey.json";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";

const Blob: React.FC = () => {
  const { onError } = useQuerySnackbar();
  const params = useParams<{ id: string }>();
  const {
    state: { oid },
  } = useLocation<{ oid: string; path: string }>();
  const id = Number(params.id);
  const musicBlob = useQuery(
    [queryKey.MUSIC, id, queryKey.BLOB],
    getMusicBlob(id, oid),
    {
      onError,
    }
  );
  return (
    <Paper>
      <SyntaxHighlighter style={github as unknown}>
        {musicBlob.data?.blob || ""}
      </SyntaxHighlighter>
    </Paper>
  );
};
export default Blob;
