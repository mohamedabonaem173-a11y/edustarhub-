// pages/_app.js
import "../style/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}