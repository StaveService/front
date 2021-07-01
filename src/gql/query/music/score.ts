import { gql } from "graphql-request";

const musicScoreQuery = gql`
  query getMusic($id: Int!) {
    music(id: $id) {
      id
      title
      tab
    }
  }
`;

export default musicScoreQuery;
