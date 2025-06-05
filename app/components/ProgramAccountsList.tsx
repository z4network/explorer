'use client';

import React, { useEffect, useState } from 'react';

import { getAccountCount } from '../providers/cluster';
import { lamportsToSol } from '../utils/index';

interface Account {
    pubkey: string;
    lamports: number;
    dataLength: number;
    executable: boolean;
    owner: string;
    rentEpoch: number;
}

interface ProgramAccountsListProps {
    programId: string;
}

export function ProgramAccountsList({ programId }: ProgramAccountsListProps) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const accountsPerPage = 10;

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getAccountCount(programId);
                setAccounts(result.accounts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [programId]);

    if (loading) {
        return (
            <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card-body">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(accounts.length / accountsPerPage);
    const startIndex = (page - 1) * accountsPerPage;
    const displayedAccounts = accounts.slice(startIndex, startIndex + accountsPerPage);

    return (
        <div className="card-body">
            <div className="table-responsive">
                <table className="table table-sm table-nowrap card-table">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                    <thead>
                        <tr>
                            <th className="text-muted">Account Address</th>
                            <th className="text-muted">Balance (SOL)</th>
                            <th className="text-muted">Data Size</th>
                            <th className="text-muted">Owner</th>
                        </tr>
                    </thead>
                    <tbody className="list">
                        {displayedAccounts.map((account) => (
                            <tr key={account.pubkey}>
                                <td>
                                    <span className="address-truncate">
                                        {account.pubkey}
                                    </span>
                                </td>
                                <td>{lamportsToSol(account.lamports)}</td>
                                <td>{account.dataLength} byte(s)</td>
                                <td>
                                    <span className="address-truncate">
                                        {account.owner}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="card-footer">
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li
                                    key={i + 1}
                                    className={`page-item ${page === i + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
}