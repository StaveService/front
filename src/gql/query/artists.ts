import { gql } from "graphql-request";

const artistsQuery = gql`
  query getArtists($page: Int!, $q: JSON) {
    artists(page: $page, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        name
        link {
          twitter
        }
      }
    }
  }
`;
export default artistsQuery;
