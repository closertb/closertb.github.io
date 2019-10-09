/* eslint-disable react/button-has-type */
import React from 'react';
import { NavMenu } from 'configs/menu';
import style from './index.less';

export default function NavCenter() {
  return (
    <div className={style.Action}>
      {NavMenu.map(({ name, path, imgUrl, git }) => (
        <div key={path} className="block">
          <h3 className="block-title">
            <span>{name}</span>
            <a href={git} target="_blank" className="small-git" rel="noopener noreferrer">git</a>
          </h3>
          <div>
            <div>
              <img className="show-img" src={imgUrl} alt={name} />
            </div>
            <div>
              <a href={`${path}/index.html`} className="button" target="_blank" rel="noopener noreferrer">查看演示</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
