'use client';

import { WalletContextProvider } from '@/components/WalletProvider';
import TutorPage from '@/components/TutorPage';

export default function Home() {
  return (
    <WalletContextProvider>
      <TutorPage />
    </WalletContextProvider>
  );
}
