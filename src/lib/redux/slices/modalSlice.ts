import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/lib/types/entities';

interface ModalState {
  isTransferModalOpen: boolean;
  transferTargetUser: User | null;
}

const initialState: ModalState = {
  isTransferModalOpen: false,
  transferTargetUser: null,
};

const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openTransferModal: (state, action: PayloadAction<User>) => {
      state.isTransferModalOpen = true;
      state.transferTargetUser = action.payload;
    },
    closeTransferModal: state => {
      state.isTransferModalOpen = false;
      state.transferTargetUser = null;
    },
  },
});

export const { openTransferModal, closeTransferModal } = modalSlice.actions;
export default modalSlice.reducer;
