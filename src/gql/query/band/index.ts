import { gql } from "graphql-request";

const bandQuery = gql`
  query getBand($id: Int!, $currentUserId: Int) {
    band(id: $id) {
      id
      name
      link {
        id
        itunes
        twitter
        wikipedia
        spotify
      }
      artists {
        id
        name
        link {
          id
          twitter
        }
      }
      bookmark(currentUserId: $currentUserId) {
        id
      }
      bookmarksCount
    }
  }
`;
export default bandQuery;
