import { gql } from "graphql-request";

export const albumQuery = gql`
  query getAlbum(
    $id: Int!
    $currentUserId: Int
    $musicPage: Int!
    $albumPage: Int!
  ) {
    artist(id: $id) {
      id
      name
      musics(musicPage: $musicPage) {
        data {
          id
          title
          musicLink {
            itunes
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
      albums(albumPage: $albumPage) {
        data {
          id
          title
          albumLink {
            itunes
          }
        }
        pagination {
          totalPages
        }
      }
      bookmark(currentUserId: $currentUserId) {
        id
      }
    }
  }
`;
export default undefined;
