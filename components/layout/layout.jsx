import React from 'react'
import Header from '/components/layout/components/header/header.jsx'
import Footer from '/components/layout/components/footer/footer.jsx'

export default function Layout({children}) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	)
}