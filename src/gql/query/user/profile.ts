import { gql } from "graphql-request";

const userProfileQuery = gql`
  query getUserMusics($id: Int!) {
    user(id: $id) {
      link {
        id
        twitter
      }
    }
  }
`;

export default userProfileQuery;
