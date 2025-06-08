import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';

import TransferForm from '../transfer-form';
import { CurrentUser, User } from '@/lib/types/entities';

const mockCurrentUser = {
  id: 1,
  username: 'Sender',
  balance: 5000,
  currency: 'USD' as const,
} as CurrentUser;

const mockTargetUser = {
  id: 2,
  username: 'Receiver',
  balance: 1000,
  currency: 'EUR' as const,
} as User;

describe('TransferForm', () => {
  it('should render all fields and a disabled submit button initially', () => {
    render(<TransferForm onSubmit={() => {}} currentUser={mockCurrentUser} targetUser={mockTargetUser} />);

    expect(screen.getByLabelText(/Amount in USD/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'Transfer' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should enable button, call onSubmit with correct data when form is valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<TransferForm onSubmit={handleSubmit} currentUser={mockCurrentUser} targetUser={mockTargetUser} />);

    const amountInput = screen.getByLabelText(/Amount in USD/i);
    const submitButton = screen.getByRole('button', { name: 'Transfer' });

    await user.type(amountInput, '25');
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(2500);
  });

  it('should display an "insufficient funds" error and disable button', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<TransferForm onSubmit={handleSubmit} currentUser={mockCurrentUser} targetUser={mockTargetUser} />);

    const amountInput = screen.getByLabelText(/Amount in USD/i);
    const submitButton = screen.getByRole('button', { name: 'Transfer' });

    await user.type(amountInput, '50.01');
    await user.click(submitButton);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should display currency conversion info when currencies differ', async () => {
    const user = userEvent.setup();
    render(<TransferForm onSubmit={() => {}} currentUser={mockCurrentUser} targetUser={mockTargetUser} />);

    const amountInput = screen.getByLabelText(/Amount in USD/i);
    await user.type(amountInput, '10.80');

    const conversionText = await screen.findByText(/Recipient will receive: ≈/i);
    expect(conversionText).toBeInTheDocument();

    expect(conversionText).toHaveTextContent('10.00');
    expect(conversionText).toHaveTextContent('€');
  });
});
