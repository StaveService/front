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
      artistLink {
        id
        itunes
        twitter
      }
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
          albumLink {
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
        bandLink {
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
