import sequelize from '../models/index.js';
import axios from 'axios';

class MatchesService {

  getEndpointUrl() {
    const teamKey = process.env.TEAM_KEY;
    const apiKey = process.env.SOCCER_API_KEY;
    const apiUrl = process.env.SOCCER_API_URL;

    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate);
    const daysToCallBack = process.env.SOCCER_API_HISTORY;
    oneWeekAgo.setDate(currentDate.getDate() - daysToCallBack);

    const fromDate = oneWeekAgo.toISOString().split('T')[0];
    const toDate = currentDate.toISOString().split('T')[0];
    const action = 'get_events';
    return `${apiUrl}?action=${action}&from=${fromDate}` +
      `&to=${toDate}&team_id=${teamKey}&APIkey=${apiKey}`;
  }

  async update() {
    const teamKey = process.env.TEAM_KEY;
    const fullUrl = this.getEndpointUrl();
    const apiResponse = await axios.get(fullUrl);
    for (const match of apiResponse.data) {
      const [ result ] = await sequelize
        .query(`select count(*) from matches WHERE key ='${match.match_id}'`);
      if (parseInt(result[0].count) === 0) {
        await sequelize.query(
          `INSERT INTO matches ` +
          `(id,key,team_id,country,league,date,status,match_time,home_score,away_score) ` +
          `VALUES (DEFAULT,'${match.match_id}','${teamKey}','${match.country_name}',` +
          `'${match.league_name}','${match.match_date}','${match.match_status}',` +
          `'${match.match_time}','${match.match_hometeam_score}',` +
          `'${match.match_awayteam_score}')`
        );
      }
    }
  }

  async getAll(teamId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = 'SELECT * FROM matches WHERE team_id = $teamId ' +
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

export default MatchesService;