import { gql } from "graphql-request";

export const artistsQuery = gql`
  query getArtists($page: Int) {
    artists(page: $page) {
      pagination {
        totalPages
      }
      data {
        id
        name
      }
    }
  }
`;
export default undefined;
