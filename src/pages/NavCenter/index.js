/* eslint-disable react/button-has-type */
import React from 'react';
import { NavMenu } from '../../configs/menu';
import style from './index.less';

export default function NavCenter() {
  return (
    <div className={style.Action}>
      {NavMenu.map(({ name, path, imgUrl }) => (
        <div key={path} className="block">
          <h3>{name}</h3>
          <div>
            <div>
              <img className="show-img" src={imgUrl} alt={name} />
            </div>
            <div>
              <a href={`${path}/index.html`} className="button" target="_blank" rel="noopener noreferrer">跳转到</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
