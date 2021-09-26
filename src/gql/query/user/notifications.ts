import { gql } from "graphql-request";

const userNotificationsQuery = gql`
  query getNotifications($id: Int!, $notificationPage: Int!, $locale: String!) {
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
                title(locale: $locale)
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
        notificationExist
      }
    }
  }
`;

export default userNotificationsQuery;
