import { gql } from "graphql-request";

const albumsQuery = gql`
  query getAlbums($page: Int!, $q: JSON) {
    albums(page: $page, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        title
        link {
          itunes
        }
      }
    }
  }
`;
export default albumsQuery;
