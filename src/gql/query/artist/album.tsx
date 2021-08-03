import { gql } from "graphql-request";

const artistAlbumsQuery = gql`
  query getArtist($id: Int!, $albumPage: Int!, $locale: String!) {
    artist(id: $id) {
      albums(albumPage: $albumPage) {
        data {
          id
          title(locale: $locale)
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
