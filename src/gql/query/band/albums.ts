import { gql } from "graphql-request";

const bandAlbumsQuery = gql`
  query getBandAlbums($id: Int!, $albumPage: Int!) {
    band(id: $id) {
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
export default bandAlbumsQuery;
