import { gql } from "graphql-request";

const blobQuery = gql`
  query getBlob($id: Int!, $oid: String!) {
    music(id: $id) {
      blob(oid: $oid)
    }
  }
`;

export default blobQuery;
