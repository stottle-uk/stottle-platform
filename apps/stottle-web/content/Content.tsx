import React from 'react';
import styles from './Content.module.scss';
import ContentItem from './ContentItem';

const items = [
  {
    title: 'Writing',
    logo: '/logos/logo-medium.svg',
    link: 'https://medium.com/@stuarttottle'
  },
  {
    title: 'Code',
    logo: '/logos/logo-github.svg',
    link: 'https://github.com/stottle-uk'
  },
  {
    title: 'Profile',
    logo: '/logos/logo-linked-in.svg',
    link: 'https://www.linkedin.com/in/stuarttottle/'
  }
].map(i => <ContentItem key={i.title} item={i} />);

const Content: React.FC = () => <div className={styles.content}>{items}</div>;

export default Content;
