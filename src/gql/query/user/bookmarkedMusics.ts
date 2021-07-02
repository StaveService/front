import { gql } from "graphql-request";

const userBookmarkedMusicsQuery = gql`
  query getBookmarkMusic($id: Int!, $bookmarkedMusicPage: Int!) {
    user(id: $id) {
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
    }
  }
`;

export default userBookmarkedMusicsQuery;
