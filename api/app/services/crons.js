import cron from 'node-cron';
import PlayersService from './players.js';
import MatchesService from './matches.js';

class CronsService {
  scheduleMatches(schedule) {
    cron.schedule(schedule, async () => this.updateMatches());
  }

  schedulePlayers(schedule) {
    cron.schedule(schedule, async () => this.updatePlayers());
  }

  async updateMatches() {
    const matchesService = new MatchesService();
    await matchesService.update();
  }

  async updatePlayers() {
    const playersService = new PlayersService();
    await playersService.update();
  }
}

export default CronsService;