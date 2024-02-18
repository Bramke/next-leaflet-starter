import SettingsProvider from '@components/Providers/SettingsProvider';
import '@styles/globals.scss'
import "nextjs-components/src/styles/globals.css";


function MyApp({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Component {...pageProps} />
    </SettingsProvider>
  )
}

export default MyApp
