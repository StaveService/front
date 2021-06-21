import { gql } from "graphql-request";

export const usersQuery = gql`
  query getUsers($page: Int!) {
    users(page: $page) {
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
export default undefined;
