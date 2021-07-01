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
        }
      }
    }
  }
`;

export default userFollowerQuery;
