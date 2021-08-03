import { gql } from "graphql-request";

const userBookmarkedMusicsQuery = gql`
  query getBookmarkMusic(
    $id: Int!
    $bookmarkedMusicPage: Int!
    $locale: String!
  ) {
    user(id: $id) {
      bookmarkedMusics(bookmarkedMusicPage: $bookmarkedMusicPage) {
        data {
          id
          title(locale: $locale)
          band {
            name(locale: $locale)
          }
          composers {
            id
            name(locale: $locale)
          }
          lyrists {
            id
            name(locale: $locale)
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
