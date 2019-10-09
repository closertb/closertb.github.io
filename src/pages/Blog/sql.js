import gql from 'graphql-tag';
import { OWNER, PROJECT } from '../../configs/constants';

export const sql = gql`
query Blog($pageFirst: Int, $pageLast: Int, $pageBefore: String, $pageAfter: String){
  repository(owner: ${OWNER}, name: ${PROJECT}) {
    sshUrl
    issues(first: $pageFirst, last: $pageLast, states:OPEN, before: $pageBefore,  after: $pageAfter, orderBy: {
      field: CREATED_AT
      direction: DESC
    }, filterBy: {
      createdBy: ${OWNER}
    }) {
      totalCount
      edges {
        cursor
        node {
          title
          url
          createdAt
          updatedAt
          reactions(first: 100) {
            totalCount
            nodes {
              content
            }
          }
        }
      }
    }
  }
}`;
