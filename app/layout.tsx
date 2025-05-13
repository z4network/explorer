import './scss/theme-dark.scss';

import { ClusterModal } from '@components/ClusterModal';
import { ClusterStatusButton } from '@components/ClusterStatusButton';
import { MessageBanner } from '@components/MessageBanner';
import { Navbar } from '@components/Navbar';
import { ClusterProvider } from '@providers/cluster';
import { ScrollAnchorProvider } from '@providers/scroll-anchor';
import type { Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Rubik } from 'next/font/google';
import { Metadata } from 'next/types';
const SearchBar = dynamic(() => import('@components/SearchBar'), {
    ssr: false,
});

export const metadata: Metadata = {
    description: 'Inspect transactions, accounts, blocks, and more on the Z4Network blockchain',
    manifest: '/manifest.json',
    title: 'Explorer | Z4Network',
};

export const viewport: Viewport = {
    initialScale: 1,
    maximumScale: 1,
    width: 'device-width',
};

const rubikFont = Rubik({
    display: 'swap',
    subsets: ['latin'],
    variable: '--explorer-default-font',
    weight: ['300', '400', '700'],
});

export default function RootLayout({
    analytics,
    children,
}: {
    analytics?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${rubikFont.variable}`}>
            <head>
                <link rel="icon" href="/favicon.png" type="image/png" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
            <body>
                <ScrollAnchorProvider>
                    <ClusterProvider>
                        <ClusterModal />
                        <div className="main-content pb-4">
                            <Navbar>
                                <SearchBar />
                            </Navbar>
                            <MessageBanner />
                            <div className="container my-3 d-lg-none">
                                <SearchBar />
                            </div>
                            <div className="container my-3 d-lg-none">
                                <ClusterStatusButton />
                            </div>
                            {children}
                        </div>
                    </ClusterProvider>
                </ScrollAnchorProvider>
                {analytics}

                <div className="text-center">

                    <footer>
                        <div className="container text-center">
                            <hr />
                            <div className="row text-start">
                                {/* About */}
                                <div className="col">
                                    <h4 className="fw-bold text-decoration-underline">About</h4>
                                    <ul className="list-unstyled">
                                        <li><a href="/about.html" className="text-white text-decoration-none">About Us</a></li>
                                        <li><a href="#" className="text-white text-decoration-none">Whitepaper</a></li>
                                        <li><a href="#" className="text-white text-decoration-none">Tokenomics</a></li>
                                    </ul>
                                </div>

                                {/* Compliance */}
                                <div className="col">
                                    <h4 className="fw-bold text-decoration-underline">Terms & Policy</h4>
                                    <ul className="list-unstyled">
                                        <li><a href="/anti_money_laundering.html" className="text-white text-decoration-none">AML Policy</a></li>
                                        <li><a href="/privacy_policy.html" className="text-white text-decoration-none">Privacy Policy</a></li>
                                        <li><a href="/terms_use.html" className="text-white text-decoration-none">Terms of Use</a></li>
                                    </ul>
                                </div>

                                {/* Ecosystem */}
                                <div className="col">
                                    <h4 className="fw-bold text-decoration-underline">Ecosystem</h4>
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="text-white text-decoration-none">Z4Wallet</a></li>
                                        <li><a href="#" className="text-white text-decoration-none">Z4Exchange</a></li>
                                        <li><a href="#" className="text-white text-decoration-none">Z4Pay</a></li>
                                    </ul>
                                </div>

                                {/* Resources */}
                                <div className="col">
                                    <h4 className="fw-bold text-decoration-underline">Resources</h4>
                                    <ul className="list-unstyled">
                                        <li><a href="#" className="text-white text-decoration-none">Documents</a></li>
                                        <li><a href="#" className="text-white text-decoration-none">Solutions</a></li>
                                        <li><a href="#" className="text-white text-decoration-none">Developments</a></li>
                                    </ul>
                                </div>

                                {/* Social Media */}
                                <div className="col">
                                    <h4 className="fw-bold text-decoration-underline">Social Media</h4>
                                    <ul className="list-unstyled">
                                        <li><a href="https://www.facebook.com/Z4Network" className="text-white text-decoration-none">Facebook</a></li>
                                        <li><a href="https://t.me/Z4Network" className="text-white text-decoration-none">Telegram</a></li>
                                        <li><a href="https://x.com/Z4Network" className="text-white text-decoration-none">Twitter</a></li>
                                    </ul>
                                </div>
                            </div>
                            <hr />
                        </div>
                    </footer>
                    Copyright © 2021-2025 Z4Network BlockChain Ltd.<sup>®</sup> <br />All rights reserved.
                </div>



            </body>
        </html>
    );
}
