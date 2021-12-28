import { AppProps } from 'next/app';
import Head from 'next/head';
import './index.scss';
import './styles.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Stuart Tottle - Software Engineer</title>
        <meta
          name="description"
          content="Stuart Tottle - Software Engineer based in the UK"
        />
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
