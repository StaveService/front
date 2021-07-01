import { gql } from "graphql-request";

const artistAlbumsQuery = gql`
  query getArtist($id: Int!, $albumPage: Int!) {
    artist(id: $id) {
      albums(albumPage: $albumPage) {
        data {
          id
          title
          link {
            itunes
          }
        }
        pagination {
          totalPages
        }
      }
    }
  }
`;
export default artistAlbumsQuery;
