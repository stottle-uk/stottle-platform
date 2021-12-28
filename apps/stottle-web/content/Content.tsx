import React from 'react';
import styles from './Content.module.scss';
import ContentItem from './ContentItem';
import github from './logos/logo-github.svg';
import linkedin from './logos/logo-linked-in.svg';
import medium from './logos/logo-medium.svg';

const items = [
  {
    title: 'Writing',
    logo: medium,
    link: 'https://medium.com/@stuarttottle',
  },
  {
    title: 'Code',
    logo: github,
    link: 'https://github.com/stottle-uk',
  },
  {
    title: 'Profile',
    logo: linkedin,
    link: 'https://www.linkedin.com/in/stuarttottle/',
  },
].map((i) => <ContentItem key={i.title} item={i} />);

const Content: React.FC = () => <div className={styles.content}>{items}</div>;

export default Content;
