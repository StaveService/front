import React from "react";
import { useQuery } from "react-query";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  CodeComponent,
  ReactMarkdownNames,
} from "react-markdown/src/ast-to-react";
import { dark } from "@material-ui/core/styles/createPalette";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";
import { getIssue } from "../../../../../gql";
import queryKey from "../../../../../constants/queryKey.json";

const Show: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { onError } = useQuerySnackbar();
  const { data, isLoading } = useQuery([queryKey.ISSUE, id], getIssue(id), {
    onError,
  });

  const CodeBlock: CodeComponent | ReactMarkdownNames = ({
    // eslint-disable-next-line react/prop-types
    inline,
    // eslint-disable-next-line react/prop-types
    className,
    // eslint-disable-next-line react/prop-types
    children,
    ...props
  }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={dark}
        language={match[1]}
        PreTag="div"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  const components = {
    code: CodeBlock,
  };
  return (
    <>
      {isLoading && <LinearProgress />}
      <Typography variant="h3">{data?.title}</Typography>
      <ReactMarkdown components={components}>
        {data?.description || ""}
      </ReactMarkdown>
    </>
  );
};
export default Show;
