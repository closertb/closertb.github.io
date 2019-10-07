import gql from 'graphql-tag';
import { OWNER, PROJECT } from '../../configs/constants';

export const sql = gql`query BlogDetail($number: Int!) {
  repository(owner: ${OWNER}, name: ${PROJECT}) {
    issue(number: $number) {
      title
      url
      bodyHTML
      updatedAt
      comments(first:100) {
        totalCount
        nodes {
          createdAt
          bodyHTML
          author {
            login
            avatarUrl
          }
        }
      }
      reactions(first: 100) {
        totalCount
        nodes {
          content
        }
      }
    }
  }
}`;
