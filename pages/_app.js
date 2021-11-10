/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'
import Layout from '../components/layout/layout.jsx'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp