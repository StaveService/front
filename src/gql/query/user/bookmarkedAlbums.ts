import { gql } from "graphql-request";

const userBookmarkedAlbumsQuery = gql`
  query getBookmarkAlbums(
    $id: Int!
    $bookmarkedAlbumPage: Int!
    $locale: String!
  ) {
    user(id: $id) {
      bookmarkedAlbums(bookmarkedAlbumPage: $bookmarkedAlbumPage) {
        data {
          id
          title(locale: $locale)
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

export default userBookmarkedAlbumsQuery;
