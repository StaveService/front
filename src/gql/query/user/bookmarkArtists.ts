import { gql } from "graphql-request";

const userBookmarkArtistsQuery = gql`
  query getUserMusics($id: Int!, $bookmarkedArtistPage: Int!) {
    user(id: $id) {
      bookmarkedArtists(bookmarkedArtistPage: $bookmarkedArtistPage) {
        data {
          id
          name
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
    }
  }
`;

export default userBookmarkArtistsQuery;
