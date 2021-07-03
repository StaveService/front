import { gql } from "graphql-request";

const userBookmarkedAlbumsQuery = gql`
  query getBookmarkAlbums($id: Int!, $bookmarkedAlbumPage: Int!) {
    user(id: $id) {
      bookmarkedAlbums(bookmarkedAlbumPage: $bookmarkedAlbumPage) {
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
    }
  }
`;

export default userBookmarkedAlbumsQuery;
