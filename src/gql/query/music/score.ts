import { gql } from "graphql-request";

const musicScoreQuery = gql`
  query getMusic($id: Int!) {
    music(id: $id) {
      id
      title
      score
    }
  }
`;

export default musicScoreQuery;
