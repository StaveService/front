import { gql } from "graphql-request";

export const userQuery = gql`
  query getUser(
    $id: Int!
    $musicPage: Int!
    $bookmarkedMusicPage: Int!
    $bookmarkedBandPage: Int!
    $bookmarkedArtistPage: Int!
  ) {
    user(id: $id) {
      nickname
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
          musicLink {
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
          musicLink {
            itunes
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
          bandLink {
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
          artistLink {
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
