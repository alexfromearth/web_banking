import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Provider as ReduxProvider } from 'react-redux';

import enMessages from '../../messages/en.json';

import { makeStore, AppStore, RootState } from '@/lib/redux/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: RootState;
  store?: AppStore;
}

const renderWithProviders = (
  ui: ReactElement,
  { preloadedState, store = makeStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }): ReactNode => {
    return (
      <ReduxProvider store={store}>
        <NextIntlClientProvider locale='ru' messages={enMessages}>
          {children}
        </NextIntlClientProvider>
      </ReduxProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { renderWithProviders as render };
