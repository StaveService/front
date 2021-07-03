import { gql } from "graphql-request";

const userBookmarkedArtistsQuery = gql`
  query getBookmarkAlbums($id: Int!, $bookmarkedAlbumsPage: Int!) {
    user(id: $id) {
      bookmarkedAlbums(bookmarkedAlbumPage: $bookmarkedAlbumPage) {
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
