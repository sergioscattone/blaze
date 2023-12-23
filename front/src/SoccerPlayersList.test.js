import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SoccerPlayersList from './SoccerPlayersList';
import configs from './configs';

const mockAxios = new MockAdapter(axios);

beforeEach(() => {
  mockAxios.reset();
});

test('renders SoccerPlayersList component', async () => {
  const endpointUrl = `${configs.apiUrl}teams/${configs.teams[0].id}/players?page=1`;
  mockAxios.onGet(endpointUrl).reply(200, [
    {
      id: 1,
      name: 'Player 1',
      number: 10,
      type: 'Forward',
      age: 25,
      ranking: 8,
    },
    {
      id: 2,
      name: 'Player 2',
      number: 7,
      type: 'Midfielder',
      age: 28,
      ranking: 9,
    },
  ]);

  const { getByText } = render(<SoccerPlayersList teamKey={configs.teams[0].id}/>);

  await waitFor(() => {
    const player1 = getByText(/Player 1 \(10\) - Forward: 25 year's old with ranking 8/i);
    const player2 = getByText(/Player 2 \(7\) - Midfielder: 28 year's old with ranking 9/i);
    expect(player1).toBeInTheDocument();
    expect(player2).toBeInTheDocument();
  });
});