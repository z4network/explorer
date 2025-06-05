'use client';

import React, { useState } from 'react';

import { ProgramAccountsList } from './ProgramAccountsList';

interface ActiveAccountHoldersProps {
    programId: string;
    accountCount: number;
}

export function ActiveAccountHolders({ programId, accountCount }: ActiveAccountHoldersProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="card">
            <div 
                className="card-header cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer' }}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="card-header-title">
                        Active Account Holders
                    </h3>
                    <div className="d-flex align-items-center">
                        <span className="badge bg-primary rounded-pill me-2">
                            {accountCount}
                        </span>
                        <button
                            className={`btn btn-sm btn-white ${isExpanded ? 'active' : ''}`}
                            type="button"
                            aria-expanded={isExpanded}
                        >
                            <i className={`fe fe-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        </button>
                    </div>
                </div>
            </div>
            
            {isExpanded && (
                <ProgramAccountsList programId={programId} />
            )}
        </div>
    );
}