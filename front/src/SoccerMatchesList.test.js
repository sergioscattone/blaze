import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SoccerMatchesList from './SoccerMatchesList';
import configs from './configs';

const mockAxios = new MockAdapter(axios);

beforeEach(() => {
  mockAxios.reset();
});

test('renders SoccerMatchesList component', async () => {
  const endpointUrl = `${configs.apiUrl}teams/${configs.teams[0].id}/matches?page=1`;
  mockAxios.onGet(endpointUrl).reply(200, [
    {
      id: 1,
      date: '2023-01-01',
      league: 'Premier League',
      home_score: 3,
      away_score: 1,
    },
    {
      id: 2,
      date: '2023-01-05',
      league: 'La Liga',
      home_score: 1,
      away_score: 1,
    },
  ]);

  const { getByText } = render(<SoccerMatchesList teamKey={configs.teams[0].id} />);

  await waitFor(() => {
    const match1 = getByText(/2023-01-01 - Premier League: 3-1/i);
    const match2 = getByText(/2023-01-05 - La Liga: 1-1/i);
    expect(match1).toBeInTheDocument();
    expect(match2).toBeInTheDocument();
  });
});