import { gql } from "graphql-request";

const albumMusicsQuery = gql`
  query getAlbumMusics($id: Int!, $musicPage: Int!) {
    album(id: $id) {
      musics(musicPage: $musicPage) {
        data {
          id
          title
          link {
            itunes
            spotify
          }
          band {
            name
          }
          composers {
            id
            name
          }
          lyrists {
            id
            name
          }
        }
        pagination {
          totalPages
        }
      }
    }
  }
`;
export default albumMusicsQuery;
