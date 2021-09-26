import { gql } from "graphql-request";

const userQuery = gql`
  query getUser($id: Int!, $currentUserId: Int) {
    user(id: $id) {
      nickname
      introduction
      followingCount
      followersCount
      followed(currentUserId: $currentUserId) {
        id
      }
    }
  }
`;

export default userQuery;
