import { TransactionStatus } from '@/routes/transactions/entities/transaction-status.entity';
import { multisigTransactionBuilder } from '@/domain/safe/entities/__tests__/multisig-transaction.builder';
import { confirmationBuilder } from '@/domain/safe/entities/__tests__/multisig-transaction-confirmation.builder';
import { safeBuilder } from '@/domain/safe/entities/__tests__/safe.builder';
import { MultisigTransactionStatusMapper } from '@/routes/transactions/mappers/multisig-transactions/multisig-transaction-status.mapper';

describe('Multisig Transaction status mapper (Unit)', () => {
  let mapper: MultisigTransactionStatusMapper;

  beforeEach(() => {
    mapper = new MultisigTransactionStatusMapper();
  });

  it('should return a SUCCESS status', async () => {
    const transaction = (await multisigTransactionBuilder())
      .with('isExecuted', true)
      .with('isSuccessful', true)
      .build();
    const safe = safeBuilder().build();

    expect(mapper.mapTransactionStatus(transaction, safe)).toBe(
      TransactionStatus.Success,
    );
  });

  it('should return a FAILED status', async () => {
    const transaction = (await multisigTransactionBuilder())
      .with('isExecuted', true)
      .with('isSuccessful', false)
      .build();
    const safe = safeBuilder().build();

    expect(mapper.mapTransactionStatus(transaction, safe)).toBe(
      TransactionStatus.Failed,
    );
  });

  it('should return a CANCELLED status', async () => {
    const transaction = (await multisigTransactionBuilder())
      .with('isExecuted', false)
      .with('nonce', 2)
      .build();
    const safe = { ...safeBuilder().build(), nonce: 3 };

    expect(mapper.mapTransactionStatus(transaction, safe)).toBe(
      TransactionStatus.Cancelled,
    );
  });

  it('should return an AWAITING_CONFIRMATIONS status', async () => {
    const transaction = (await multisigTransactionBuilder())
      .with('isExecuted', false)
      .with('nonce', 4)
      .with('confirmations', [
        (await confirmationBuilder()).build(),
        (await confirmationBuilder()).build(),
      ])
      .with('confirmationsRequired', 3)
      .build();
    const safe = { ...safeBuilder().build(), nonce: 3 };

    expect(mapper.mapTransactionStatus(transaction, safe)).toBe(
      TransactionStatus.AwaitingConfirmations,
    );
  });

  it('should return an AWAITING_EXECUTION status', async () => {
    const transaction = (await multisigTransactionBuilder())
      .with('isExecuted', false)
      .with('nonce', 4)
      .with('confirmations', [
        (await confirmationBuilder()).build(),
        (await confirmationBuilder()).build(),
      ])
      .with('confirmationsRequired', 1)
      .build();
    const safe = { ...safeBuilder().build(), nonce: 3 };

    expect(mapper.mapTransactionStatus(transaction, safe)).toBe(
      TransactionStatus.AwaitingExecution,
    );
  });
});
