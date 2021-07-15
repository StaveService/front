import { gql } from "graphql-request";

const usersQuery = gql`
  query getUsers($page: Int!, $q: JSON) {
    users(page: $page, q: $q) {
      pagination {
        totalPages
      }
      data {
        id
        nickname
        link {
          twitter
        }
      }
    }
  }
`;
export default usersQuery;
