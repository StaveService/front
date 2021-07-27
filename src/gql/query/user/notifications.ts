import { gql } from "graphql-request";

const userNotificationsQuery = gql`
  query getNotificationsMusics($id: Int!, $notificationPage: Int!) {
    user(id: $id) {
      notifications(notificationPage: $notificationPage) {
        data {
          id
          recipientType
          recipientId
          type
          params {
            userRelationship {
              followed {
                id
                nickname
              }
              follower {
                id
                nickname
              }
            }
            musicBookmark {
              user {
                id
                nickname
              }
              music {
                id
                title
              }
            }
          }
          readAt
          createdAt
          updatedAt
        }
        pagination {
          totalPages
        }
      }
    }
  }
`;

export default userNotificationsQuery;
