import React from 'react';
import QueryWithLoading from '../../components/QueryWithLoading';
import { sql } from './model';
import style from './index.less';

export default function BlogDetail({ location: { pathname } }) {
  const number = pathname.replace('/blog/', '');
  if (typeof number !== 'string' && typeof +number !== 'number') {
    return <div className="content-waring">路径无效</div>;
  }

  const param = { number: +number };
  // const { loading, error, data = {} } = useQuery(query({ number }));

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :(</p>;

  // const { repository: { issue: { title, url, bodyHTML, updatedAt } } } = data;

  // if (bodyHTML === '') {
  //   return <div className="content-waring">暂无内容</div>;
  // }
  return (
    <QueryWithLoading sql={sql} query={param}>
      {({ repository: { issue: { title, url, bodyHTML, updatedAt } } }) => (
        <div className={style.Detail}>
          <div className="header">
            <h3 className="title">{title}</h3>
            <div className="info">
              <a href={url} target="_blank" rel="noopener noreferrer">原文链接</a>
              <span>{updatedAt}</span>
            </div>
          </div>
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: bodyHTML }} />
        </div>
      )}
    </QueryWithLoading>

  );
}
