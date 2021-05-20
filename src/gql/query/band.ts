import { gql } from "graphql-request";

export const bandQuery = gql`
  query getBand(
    $id: Int!
    $currentUserId: Int
    $musicPage: Int!
    $albumPage: Int!
  ) {
    band(id: $id) {
      id
      name
      bandLink {
        itunes
      }
      musics(musicPage: $musicPage) {
        data {
          id
          title
          composers {
            id
            name
          }
          lyrists {
            id
            name
          }
          user {
            nickname
          }
          musicLink {
            itunes
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
      artists {
        id
        name
      }
      bookmark(currentUserId: $currentUserId) {
        id
      }
    }
  }
`;
export default undefined;
