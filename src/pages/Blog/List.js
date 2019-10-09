import React from 'react';
import { Link } from 'react-router-dom';
import { DateFormat } from 'configs/utils';

export default function List({ totalCount = 0, edges = [] }) {
  if (totalCount === 0) {
    return (<div className="no-content">暂无文章</div>);
  }
  return (
    <div className="list-wrapper">
      <ul>
        {edges.map(({ cursor, node: { title, url, createdAt } }) => (
          <li className="block" key={url}>
            <h4 className="title">
              <Link to={`/blog/${url.replace(/.*issues\//, '')}?cursor=${cursor}`}>{title}</Link>
            </h4>
            <div className="info">
              <div className="reactions">
                <a href={url} target="_blank" rel="noopener noreferrer">Issue链接</a>
              </div>
              <span className="create-time">
                {DateFormat(createdAt)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>);
}
