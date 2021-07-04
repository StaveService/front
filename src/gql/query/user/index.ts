import { gql } from "graphql-request";

const userQuery = gql`
  query getUserMusics($id: Int!, $currentUserId: Int) {
    user(id: $id) {
      nickname
      followingCount
      followersCount
      followed(currentUserId: $currentUserId) {
        id
      }
    }
  }
`;

export default userQuery;
