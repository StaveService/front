import { gql } from "graphql-request";

const musicScoreQuery = gql`
  query getMusic($id: Int!, $locale: String!) {
    music(id: $id) {
      id
      title(locale: $locale)
      score
    }
  }
`;

export default musicScoreQuery;
