import { gql } from "graphql-request";

const userFollowerQuery = gql`
  query getUserFollower($id: Int!, $followerPage: Int!) {
    user(id: $id) {
      followers(followerPage: $followerPage) {
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
  }
`;

export default userFollowerQuery;
