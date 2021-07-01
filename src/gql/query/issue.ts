import { gql } from "graphql-request";

const issueQuery = gql`
  query getIssue($id: Int!) {
    issue(id: $id) {
      id
      title
      description
    }
  }
`;
export default issueQuery;
