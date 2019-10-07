import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Styles from './index.less';
import Loading from './Loading';
import Error from './Error';

export default function CacheQuery({ sql, query, children, callback }) {
  const { loading, error, data } = useQuery(sql, {
    variables: query
  });

  // 回调存储表要的临时变量
  if (!loading && !error && callback) {
    callback(data);
  }
  return (
    <>
      {loading &&
      <p className={Styles.Loading}>
        <Loading />
      </p>}
      {error &&
      <p className={Styles.Error}>
        <span className="error-wrap">
          <Error />
          <p>{error.message || '未知错误'}</p>
        </span>
      </p>}
      {!loading && !error && children(data)}
    </>);
}
