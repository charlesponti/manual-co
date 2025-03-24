import QueryProvider from "@/providers/query-provider";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Ponti Studios - Symptom Guidance",
	description: "symptom guidance",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<body className={`${manrope.className} antialiased`}>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
