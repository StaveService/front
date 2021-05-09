import { gql } from "graphql-request";

export const artistsQuery = gql`
  query getArtists($page: Int) {
    artists(page: $page) {
      pagination {
        currentPage
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
