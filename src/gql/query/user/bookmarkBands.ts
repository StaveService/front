import { gql } from "graphql-request";

const userBookmarkBandsQuery = gql`
  query getBookmarkBands($id: Int!, $bookmarkedBandPage: Int!) {
    user(id: $id) {
      bookmarkedBands(bookmarkedBandPage: $bookmarkedBandPage) {
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

export default userBookmarkBandsQuery;
