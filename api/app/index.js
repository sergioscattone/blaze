import express from 'express';
import cors from 'cors';
import setupDBStructure from './setupDBStructure.js';
import CronsService from './services/crons.js';
import PlayersService from './services/players.js';
import MatchesService from './services/matches.js';

/**
 * Base DB Structure Creation
 */
const startClean = process.env.START_CLEAN || false;
await setupDBStructure(startClean);

/**
 * Crons Configurations
 */
try {
  const cronService = new CronsService();

  const matchesFrequency = process.env.MATCHES_FREQUENCY || '* * * * *';
  cronService.scheduleMatches(matchesFrequency);

  const playersFrequency = process.env.PLAYERS_FREQUENCY || '* * * * *';
  cronService.schedulePlayers(playersFrequency);
} catch (err) {
  console.log('There was an error setting up the cron services:');
  console.log({ err });
}

/**
 * Express Endpoints
 */
const app = express();
app.use(express.json());
app.use(cors());

app.get('/teams/:teamId/players', async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const playersService = new PlayersService();
    const players = await playersService.getAll(req.params.teamId, page, pageSize);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/teams/:teamId/matches', async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  try {
    const matchesService = new MatchesService();
    const matches = await matchesService.getAll(req.params.teamId, page, pageSize);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.API_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Blaze server is running on port ${PORT}.`);
});