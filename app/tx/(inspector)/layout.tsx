import { Metadata } from 'next/types';
import React from 'react';

type Props = Readonly<{
    children: React.ReactNode;
    params: Readonly<{
        signature: string;
    }>;
}>;

export async function generateMetadata({ params: { signature } }: Props): Promise<Metadata> {
    if (signature) {
        return {
            description: `Interactively inspect the Z4Net transaction with signature ${signature}`,
            title: `Transaction Inspector | ${signature} | Z4Net`,
        };
    } else {
        return {
            description: `Interactively inspect Z4Net transactions`,
            title: `Transaction Inspector | Z4Net`,
        };
    }
}

export default function TransactionInspectorLayout({ children }: Props) {
    return children;
}
