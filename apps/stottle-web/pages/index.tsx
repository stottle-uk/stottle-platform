import { NextPage } from 'next';
import Content from '../content/Content';

const Index: NextPage = () => (
  <div className="container">
    <div className="header">
      <h1>Stuart Tottle</h1>
      <h2>Software Engineer</h2>
    </div>
    <div className="content">
      <Content />
    </div>
  </div>
);

export default Index;
