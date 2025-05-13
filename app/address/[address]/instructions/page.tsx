import { TokenInstructionsCard } from '@components/account/history/TokenInstructionsCard';
import getReadableTitleFromAddress, { AddressPageMetadataProps } from '@utils/get-readable-title-from-address';
import { Metadata } from 'next/types';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export async function generateMetadata(props: AddressPageMetadataProps): Promise<Metadata> {
    return {
        description: `A list of transactions that include an instruction involving the token with address ${props.params.address} on Z4Net`,
        title: `Token Instructions | ${await getReadableTitleFromAddress(props)} | Z4Net`,
    };
}

export default function TokenInstructionsPage({ params: { address } }: Props) {
    return <TokenInstructionsCard address={address} />;
}
