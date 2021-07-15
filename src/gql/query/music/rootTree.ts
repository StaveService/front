import { gql } from "graphql-request";

const rootTreeQuery = gql`
  query getRootTree($id: Int!) {
    music(id: $id) {
      rootTree {
        oid
        type
        name
        filemode
      }
    }
  }
`;

export default rootTreeQuery;
