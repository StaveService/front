import { gql } from "graphql-request";

const userFollowingQuery = gql`
  query getUserFollowing($id: Int!, $followingPage: Int!) {
    user(id: $id) {
      following(followingPage: $followingPage) {
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

export default userFollowingQuery;
