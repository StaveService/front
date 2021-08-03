import { gql } from "graphql-request";

const userBookmarkedArtistsQuery = gql`
  query getBookmarkArtists(
    $id: Int!
    $bookmarkedArtistPage: Int!
    $locale: String!
  ) {
    user(id: $id) {
      bookmarkedArtists(bookmarkedArtistPage: $bookmarkedArtistPage) {
        data {
          id
          name(locale: $locale)
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

export default userBookmarkedArtistsQuery;
