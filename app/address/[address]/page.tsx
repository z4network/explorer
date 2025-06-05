import { TransactionHistoryCard } from '@components/account/history/TransactionHistoryCard';
import { ProgramAccountsList } from '@components/ProgramAccountsList';
import { clusterUrl, DEFAULT_CLUSTER, DEFAULT_CUSTOM_URL } from '@providers/cluster';
import { Connection, PublicKey } from '@solana/web3.js';
import getReadableTitleFromAddress, { AddressPageMetadataProps } from '@utils/get-readable-title-from-address';
import { Metadata } from 'next/types';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export async function generateMetadata(props: AddressPageMetadataProps): Promise<Metadata> {
    return {
        description: `History of all transactions involving the address ${props.params.address} on Z4Net`,
        title: `Transaction History | ${await getReadableTitleFromAddress(props)} | Z4Net`,
    };
}

async function isProgram(address: string): Promise<boolean> {
    try {
        const transportUrl = clusterUrl(DEFAULT_CLUSTER, DEFAULT_CUSTOM_URL);
        const connection = new Connection(transportUrl, 'confirmed');
        const publicKey = new PublicKey(address);
        const accountInfo = await connection.getAccountInfo(publicKey);
        return accountInfo?.executable ?? false;
    } catch (error) {
        console.error('Error checking if address is a program:', error);
        return false;
    }
}

export default async function AddressPage({ params: { address } }: Props) {
    const isProgramAccount = await isProgram(address);

    return (
        <div>
            {isProgramAccount && (
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">程序账户列表</h2>
                    <ProgramAccountsList programId={address} />
                </div>
            )}
            <TransactionHistoryCard address={address} />
        </div>
    );
}