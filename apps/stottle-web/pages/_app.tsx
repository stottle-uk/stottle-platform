import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import './index.scss';
import './styles.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const app = initializeApp({
      apiKey: 'AIzaSyDkMRYsylELwrZLWu4XlBMvvQeVpZMViV0',
      authDomain: 'stottle-web.firebaseapp.com',
      projectId: 'stottle-web',
      storageBucket: 'stottle-web.appspot.com',
      messagingSenderId: '814577459797',
      appId: '1:814577459797:web:28dc22587c940e61c8eadc',
      measurementId: 'G-CSHBBRQ96C'
    });
    getAnalytics(app);
  }, []);

  return (
    <>
      <Head>
        <title>Stuart Tottle - Software Engineer</title>
        <meta
          name="description"
          content="Stuart Tottle - Software Engineer based in the UK"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
