import { gql } from "graphql-request";

const userBookmarkedBandsQuery = gql`
  query getBookmarkBands(
    $id: Int!
    $bookmarkedBandPage: Int!
    $locale: String!
  ) {
    user(id: $id) {
      bookmarkedBands(bookmarkedBandPage: $bookmarkedBandPage) {
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

export default userBookmarkedBandsQuery;
