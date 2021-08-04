import { gql } from "graphql-request";

const userBookmarkedArtistsQuery = gql`
  query getBookmarkArtists($id: Int!, $bookmarkedArtistPage: Int!) {
    user(id: $id) {
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

export default userBookmarkedArtistsQuery;
