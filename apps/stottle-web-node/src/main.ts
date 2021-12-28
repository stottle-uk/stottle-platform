import { https } from 'firebase-functions';
import { default as next } from 'next';
import { join } from 'path';

const nextjsDistDir = join('./', 'dist', 'apps', 'stottle-web', '.next');

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir
  }
});
const nextjsHandle = nextjsServer.getRequestHandler();

exports.nextjsFunc = https.onRequest((req, res) => {
  return nextjsServer.prepare().then(() => nextjsHandle(req, res));
});
