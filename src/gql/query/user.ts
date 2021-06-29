import { gql } from "graphql-request";

export const userQuery = gql`
  query getUser(
    $id: Int!
    $currentUserId: Int
    $musicPage: Int!
    $bookmarkedMusicPage: Int!
    $bookmarkedBandPage: Int!
    $bookmarkedArtistPage: Int!
  ) {
    user(id: $id) {
      nickname
      link {
        id
        twitter
      }
      followed(currentUserId: $currentUserId) {
        id
      }
      musics(musicPage: $musicPage) {
        data {
          id
          title
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
          link {
            itunes
          }
        }
        pagination {
          totalPages
        }
      }
      bookmarkedMusics(bookmarkedMusicPage: $bookmarkedMusicPage) {
        data {
          id
          title
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
          link {
            itunes
          }
          user {
            nickname
          }
        }
        pagination {
          totalPages
        }
      }
      bookmarkedBands(bookmarkedBandPage: $bookmarkedBandPage) {
        data {
          id
          name
          link {
            itunes
          }
        }
        pagination {
          totalPages
        }
      }
      bookmarkedArtists(bookmarkedArtistPage: $bookmarkedArtistPage) {
        data {
          id
          name
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

export default undefined;
