import sequelize from '../models/index.js';
import axios from 'axios';

class PlayersService {

  getEndpointUrl() {
    const teamKey = process.env.TEAM_KEY;
    const apiKey = process.env.SOCCER_API_KEY;
    const apiUrl = process.env.SOCCER_API_URL;
    const action = 'get_teams';
    return `${apiUrl}?action=${action}&team_id=${teamKey}&APIkey=${apiKey}`;
  }

  async update() {
    const teamKey = process.env.TEAM_KEY;
    const fullUrl = this.getEndpointUrl();
    const apiResponse = await axios.get(fullUrl);
    for (const player of apiResponse.data[0].players) {
      const [ result ] =
        await sequelize.query(`select count(*) from players WHERE key ='${player.player_key}'`);
      if (parseInt(result[0].count) === 0) {
        await sequelize.query(
          `INSERT INTO players ` +
          `(id,key,team_id,name,number,matches,type,age,rating) ` +
          `VALUES (DEFAULT,'${player.player_key}','${teamKey}',` +
          `'${player.player_name}','${player.player_number || 0}',` +
          `'${player.player_match_played || 0}','${player.player_type}',` +
          `'${player.player_age || 0}','${player.player_rating || 0}')`
        );
      } else {
        await sequelize.query(
          `UPDATE players SET ` +
          `team_id = '${teamKey}',name = '${player.player_name}',` +
          `number = '${player.player_number || 0}',matches = '${player.player_match_played || 0}',` +
          `type = '${player.player_type}',age = '${player.player_age || 0}',` +
          `rating = '${player.player_rating || 0}' WHERE key = '${player.player_key}'`
        );
      }
    }
  }

  async getAll(teamId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = 'SELECT * FROM players WHERE team_id = $teamId ' +
      'ORDER BY id LIMIT $limit OFFSET $offset';

    try {
      const [ result ]  = await sequelize.query(query,
        { bind: { teamId, limit, offset } });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default PlayersService;