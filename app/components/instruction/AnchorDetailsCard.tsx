import { Address } from '@components/common/Address';
import { BorshEventCoder, BorshInstructionCoder, Idl, Instruction, Program } from '@coral-xyz/anchor';
import { IdlEvent, IdlField, IdlInstruction, IdlTypeDefTyStruct } from '@coral-xyz/anchor/dist/cjs/idl';
import { SignatureResult, TransactionInstruction } from '@solana/web3.js';
import {
    getAnchorAccountsFromInstruction,
    getAnchorNameForInstruction,
    getAnchorProgramName,
    instructionIsSelfCPI,
    mapIxArgsToRows,
} from '@utils/anchor';
import { camelToTitleCase } from '@utils/index';
import { useMemo } from 'react';

import { InstructionCard } from './InstructionCard';

export default function AnchorDetailsCard(props: {
    ix: TransactionInstruction;
    index: number;
    result: SignatureResult;
    signature: string;
    innerCards?: JSX.Element[];
    childIndex?: number;
    anchorProgram: Program<Idl>;
}) {
    const { ix, anchorProgram } = props;
    const programName = getAnchorProgramName(anchorProgram) ?? 'Unknown Program';

    const ixName = getAnchorNameForInstruction(ix, anchorProgram) ?? 'Unknown Instruction';
    const cardTitle = `${camelToTitleCase(programName)}: ${camelToTitleCase(ixName)}`;

    return (
        <InstructionCard title={cardTitle} {...props}>
            <AnchorDetails ix={ix} anchorProgram={anchorProgram} />
        </InstructionCard>
    );
}

function AnchorDetails({ ix, anchorProgram }: { ix: TransactionInstruction; anchorProgram: Program }) {
    const { ixAccounts, decodedIxData, ixDef } = useMemo(() => {
        let ixAccounts:
            | {
                  name: string;
                  isMut: boolean;
                  isSigner: boolean;
                  pda?: object;
              }[]
            | null = null;
        let decodedIxData: Instruction | null = null;
        let ixDef: IdlInstruction | undefined;
        if (anchorProgram) {
            let coder: BorshInstructionCoder | BorshEventCoder;
            if (instructionIsSelfCPI(ix.data)) {
                coder = new BorshEventCoder(anchorProgram.idl);
                decodedIxData = coder.decode(ix.data.slice(8).toString('base64'));
                const ixEventDef = anchorProgram.idl.events?.find(
                    ixDef => ixDef.name === decodedIxData?.name
                ) as IdlEvent;

                const ixEventFields = anchorProgram.idl.types?.find((type: any) => type.name === ixEventDef.name);

                // Remap the event definition to an instruction definition by force casting to struct fields
                ixDef = {
                    ...ixEventDef,
                    accounts: [],
                    args: ((ixEventFields?.type as IdlTypeDefTyStruct).fields as IdlField[]) ?? [],
                };

                // Self-CPI instructions have 1 account called the eventAuthority
                // https://github.com/coral-xyz/anchor/blob/04985802587c693091f836e0083e4412148c0ca6/lang/attribute/event/src/lib.rs#L165
                ixAccounts = [{ isMut: false, isSigner: true, name: 'eventAuthority' }];
            } else {
                coder = new BorshInstructionCoder(anchorProgram.idl);
                decodedIxData = coder.decode(ix.data);
                if (decodedIxData) {
                    ixDef = anchorProgram.idl.instructions.find(ixDef => ixDef.name === decodedIxData?.name);
                    if (ixDef) {
                        ixAccounts = getAnchorAccountsFromInstruction(decodedIxData, anchorProgram);
                    }
                }
            }
        }

        return {
            decodedIxData,
            ixAccounts,
            ixDef,
        };
    }, [anchorProgram, ix.data]);

    if (!ixAccounts || !decodedIxData || !ixDef) {
        return (
            <tr>
                <td colSpan={3} className="text-lg-center">
                    Failed to decode account data according to the public Anchor interface
                </td>
            </tr>
        );
    }

    const programName = getAnchorProgramName(anchorProgram) ?? 'Unknown Program';

    return (
        <>
            <tr>
                <td>Program</td>
                <td className="text-lg-end" colSpan={2}>
                    <Address pubkey={ix.programId} alignRight link raw overrideText={programName} />
                </td>
            </tr>
            <tr className="table-sep">
                <td>Account Name</td>
                <td className="text-lg-end" colSpan={2}>
                    Address
                </td>
            </tr>
            {ix.keys.map(({ pubkey, isSigner, isWritable }, keyIndex) => {
                return (
                    <tr key={keyIndex}>
                        <td>
                            <div className="me-2 d-md-inline">
                                {ixAccounts
                                    ? keyIndex < ixAccounts.length
                                        ? `${camelToTitleCase(ixAccounts[keyIndex].name)}`
                                        : `Remaining Account #${keyIndex + 1 - ixAccounts.length}`
                                    : `Account #${keyIndex + 1}`}
                            </div>
                            {isWritable && <span className="badge bg-danger-soft me-1">Writable</span>}
                            {isSigner && <span className="badge bg-info-soft me-1">Signer</span>}
                        </td>
                        <td className="text-lg-end" colSpan={2}>
                            <Address pubkey={pubkey} alignRight link />
                        </td>
                    </tr>
                );
            })}

            {decodedIxData && ixDef && ixDef.args.length > 0 && (
                <>
                    <tr className="table-sep">
                        <td>Argument Name</td>
                        <td>Type</td>
                        <td className="text-lg-end">Value</td>
                    </tr>
                    {mapIxArgsToRows(decodedIxData.data, ixDef, anchorProgram.idl)}
                </>
            )}
        </>
    );
}
