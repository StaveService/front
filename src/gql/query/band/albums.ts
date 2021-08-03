import { gql } from "graphql-request";

const bandAlbumsQuery = gql`
  query getBandAlbums($id: Int!, $albumPage: Int!, $locale: String!) {
    band(id: $id) {
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
export default bandAlbumsQuery;
