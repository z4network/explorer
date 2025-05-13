import SupplyPageClient from './page-client';

export const metadata = {
    description: `Overview of the native token supply on Z4Net`,
    title: `Supply Overview | Z4Net`,
};

export default function SupplyPage() {
    return <SupplyPageClient />;
}
