import React from "react";
import { useLocation, useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Paper from "@material-ui/core/Paper";
import { useMusicBlobQuery } from "../../../../../reactQuery/query";

const Blob: React.FC = () => {
  const params = useParams<{ id: string }>();
  const {
    state: { oid },
  } = useLocation<{ oid: string; path: string }>();
  const id = Number(params.id);
  const musicBlob = useMusicBlobQuery({ id, oid });
  return (
    <Paper>
      <SyntaxHighlighter style={github as unknown}>
        {musicBlob.data?.blob || ""}
      </SyntaxHighlighter>
    </Paper>
  );
};
export default Blob;
