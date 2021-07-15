import { gql } from "graphql-request";

const treeQuery = gql`
  query getBlob($id: Int!, $oid: String!) {
    music(id: $id) {
      tree(oid: $oid) {
        oid
        type
        name
        filemode
      }
    }
  }
`;

export default treeQuery;
