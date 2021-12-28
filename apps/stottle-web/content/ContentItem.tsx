import Image from 'next/image';
import React from 'react';
import styles from './Content.module.scss';

interface Item {
  title: string;
  logo: string;
  link: string;
}

interface OwnProps {
  item: Item;
}

const ContentItem: React.FC<OwnProps> = ({ item }) => (
  <a
    className={styles.contentItem}
    href={item.link}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h3 className={styles.contentItemHeader}>{item.title}</h3>
    <div className={styles.contentItemBody}>
      <Image src={item.logo} alt={item.title}></Image>
      {/* <img src={item.logo} alt={item.title} /> */}
    </div>
  </a>
);

export default ContentItem;
