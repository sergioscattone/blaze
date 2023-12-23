import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import App from './App';
import configs from './configs';

const mock = new axiosMock(axios);
const matchesEndpointUrl = `${configs.apiUrl}teams/${configs.teamKey}/matches?page=1`;
mock.onGet(matchesEndpointUrl).reply(200, []);
const playersEndpointUrl = `${configs.apiUrl}teams/${configs.teamKey}/players?page=1`;
mock.onGet(playersEndpointUrl).reply(200, []);

test('renders learn react link', () => {
  render(<App />);
  const titleElement = screen.getByText(/Blaze Tech Concept - Sergio Scattone/i);
  expect(titleElement).toBeInTheDocument();
});
