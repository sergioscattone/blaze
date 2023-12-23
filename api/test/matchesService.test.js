import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import MatchesService from '../app/services/matches.js';
import sequelize from '../app/models/index.js';
import { mockMatches } from './mocks.js';

describe('MatchesService', () => {
  describe('#getEndpointUrl', () => {
    it('should return a valid endpoint URL', () => {
      process.env.TEAM_KEY = '123987';
      process.env.SOCCER_API_KEY = 'apiKey';
      process.env.SOCCER_API_URL = 'https://api.example.com/soccer';
      process.env.SOCCER_API_HISTORY = 7;

      const matchesService = new MatchesService();
      const endpointUrl = matchesService.getEndpointUrl();

      const expectedPattern = /^https:\/\/api\.example\.com\/soccer\?action=get_events&from=\d{4}-\d{2}-\d{2}&to=\d{4}-\d{2}-\d{2}&team_id=123987&APIkey=apiKey$/;
      expect(endpointUrl).to.match(expectedPattern);
    });
  });

  describe('#update', () => {
    it('should update matches', async () => {
      const teamId = '123987';
      const sandbox = sinon.createSandbox();
      sandbox.stub(axios, 'get').resolves({ data: mockMatches });
      const matchesService = new MatchesService();

      const sequelizeStub = sinon.stub(sequelize, 'query');
      for (let i=0; i<mockMatches.length; i++) {
        sequelizeStub.onCall(i*2).returns([[{ count: 0 }]]);
        sequelizeStub.onCall(i*2+1).returns([]);
      }

      await matchesService.update();
      expect(sequelizeStub.callCount).to.equal(mockMatches.length * 2);

      for (let i=0; i<mockMatches.length; i++) {
        const mockMatch = mockMatches[i];
        expect(sequelizeStub.getCall(i*2).args[0]).to
          .equal(`select count(*) from matches WHERE key ='${mockMatch.match_id}'`);
        const updateSqlExpected = `INSERT INTO matches ` +
            `(id,key,team_id,country,league,date,status,match_time,home_score,away_score) ` +
            `VALUES (DEFAULT,'${mockMatch.match_id}','${teamId}',` +
            `'${mockMatch.country_name}','${mockMatch.league_name}','${mockMatch.match_date}',` +
            `'${mockMatch.match_status}','${mockMatch.match_time}',` +
            `'${mockMatch.match_hometeam_score}','${mockMatch.match_awayteam_score}')`
        expect(sequelizeStub.getCall(i*2+1).args[0]).to.equal(updateSqlExpected);
      }

      // Now matches should not be updated, because they are already in the DB
      const lastCall = sequelizeStub.callCount;
      sequelizeStub.onCall(lastCall).returns([[{ count: 1 }]]);
      sequelizeStub.onCall(lastCall+1).returns([[{ count: 1 }]]);

      await matchesService.update();
      expect(sequelizeStub.callCount).to.equal(lastCall+2);

      expect(sequelizeStub.getCall(lastCall).args[0]).to
        .equal(`select count(*) from matches WHERE key ='${mockMatches[0].match_id}'`);
      expect(sequelizeStub.getCall(lastCall+1).args[0]).to
        .equal(`select count(*) from matches WHERE key ='${mockMatches[1].match_id}'`);
        
      sequelizeStub.restore();
      sandbox.restore();
    });
  });


  describe('#getAll', () => {
    it('should get all matches', async () => {
      const sequelizeStub = sinon.stub(sequelize, 'query').resolves([mockMatches]);

      const matchesService = new MatchesService();
      const result = await matchesService.getAll();
      expect(result).to.deep.equal(mockMatches);

      sequelizeStub.restore();
    });
  });
});