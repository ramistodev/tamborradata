import { render, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import {
  queryClient,
  ReactQueryProvider,
} from '@/app/(frontend)/[locale]/providers/ReactQueryProvider';

function ClientProbe() {
  const client = useQueryClient();

  return <p data-testid="probe">{client === queryClient ? 'same' : 'different'}</p>;
}

describe('ReactQueryProvider', () => {
  it('renders its children', () => {
    render(
      <ReactQueryProvider>
        <p>child</p>
      </ReactQueryProvider>,
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('provides the exported query client', () => {
    render(
      <ReactQueryProvider>
        <ClientProbe />
      </ReactQueryProvider>,
    );

    expect(screen.getByTestId('probe')).toHaveTextContent('same');
  });

  it('configures the query and mutation defaults', () => {
    expect(queryClient.getDefaultOptions()).toEqual({
      queries: {
        staleTime: 300000,
        gcTime: 1800000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: { retry: 0 },
    });
  });
});
