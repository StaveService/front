import { gql } from "graphql-request";

export const artistQuery = gql`
  query getArtist(
    $id: Int!
    $currentUserId: Int
    $musicPage: Int!
    $albumPage: Int!
  ) {
    artist(id: $id) {
      id
      name
      link {
        id
        itunes
        twitter
        wikipedia
      }
      musics(musicPage: $musicPage) {
        data {
          id
          title
          link {
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
          user {
            nickname
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
          link {
            itunes
          }
        }
        pagination {
          totalPages
        }
      }
      bands {
        id
        name
        link {
          itunes
        }
      }
      bookmark(currentUserId: $currentUserId) {
        id
      }
    }
  }
`;
export default undefined;
