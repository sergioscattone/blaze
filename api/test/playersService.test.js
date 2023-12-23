import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import PlayersService from '../app/services/players.js';
import sequelize from '../app/models/index.js';
import { mockPlayers } from './mocks.js';

describe('PlayersService', () => {
  describe('#getEndpointUrl', () => {
    it('should return a valid endpoint URL', () => {
      process.env.TEAM_KEY = '123987';
      process.env.SOCCER_API_KEY = 'apiKey';
      process.env.SOCCER_API_URL = 'https://api.example.com/soccer';

      const playersService = new PlayersService();
      const endpointUrl = playersService.getEndpointUrl();
      
      const expectedPattern = /^https:\/\/api\.example\.com\/soccer\?action=get_teams&team_id=123987&APIkey=apiKey$/;
      expect(endpointUrl).to.match(expectedPattern);
    });
  });

  describe('#update', () => {
    it('should update players', async () => {
      const teamId = '123987';
      const sandbox = sinon.createSandbox();
      sandbox.stub(axios, 'get').resolves({ data: mockPlayers });
      const playersService = new PlayersService();

      const sequelizeStub = sinon.stub(sequelize, 'query');
      const amountPlayers = mockPlayers[0].players.length;
      for (let i=0; i<amountPlayers; i++) {
        sequelizeStub.onCall(i*2).returns([[{ count: 0 }]]);
        sequelizeStub.onCall(i*2+1).returns([]);
      }

      await playersService.update();
      expect(sequelizeStub.callCount).to.equal(amountPlayers * 2);

      for (let i=0; i<amountPlayers; i++) {
        const mockPlayer = mockPlayers[0].players[i];
        expect(sequelizeStub.getCall(i*2).args[0]).to
          .equal(`select count(*) from players WHERE key ='${mockPlayer.player_key}'`);
        const updateSqlExpected = `INSERT INTO players ` +
          `(id,key,team_id,name,number,matches,type,age,rating) ` +
          `VALUES (DEFAULT,'${mockPlayer.player_key}','${teamId}',` +
          `'${mockPlayer.player_name}','${mockPlayer.player_number || 0}',` +
          `'${mockPlayer.player_match_played || 0}','${mockPlayer.player_type}',` +
          `'${mockPlayer.player_age || 0}','${mockPlayer.player_rating || 0}')`
        expect(sequelizeStub.getCall(i*2+1).args[0]).to.equal(updateSqlExpected);
      }

      // Now players should be updated instead of inserted
      let lastCall = sequelizeStub.callCount;
      sequelizeStub.onCall(lastCall).returns([[{ count: 1 }]]);
      sequelizeStub.onCall(lastCall+1).returns([]);
      sequelizeStub.onCall(lastCall+2).returns([[{ count: 1 }]]);
      sequelizeStub.onCall(lastCall+3).returns([]);

      await playersService.update();
      expect(sequelizeStub.callCount).to.equal(lastCall+4);

      for (let i=0; i<amountPlayers; i++) {
        const player = mockPlayers[0].players[i];
        expect(sequelizeStub.getCall(lastCall++).args[0]).to.equal(
          `select count(*) from players WHERE key ='${player.player_key}'`
        );
        expect(sequelizeStub.getCall(lastCall++).args[0]).to.equal(
          `UPDATE players SET ` +
          `team_id = '${teamId}',name = '${player.player_name}',` +
          `number = '${player.player_number || 0}',matches = '${player.player_match_played || 0}',` +
          `type = '${player.player_type}',age = '${player.player_age || 0}',` +
          `rating = '${player.player_rating || 0}' WHERE key = '${player.player_key}'`
        );
      }

      expect(sequelizeStub.callCount).to.equal(lastCall);
        
      sequelizeStub.restore();
      sandbox.restore();
    });
  });


  describe('#getAll', () => {
    it('should get all players', async () => {
      const sequelizeStub = sinon.stub(sequelize, 'query').resolves([mockPlayers]);

      const playersService = new PlayersService();
      const result = await playersService.getAll();
      expect(result).to.deep.equal(mockPlayers);

      sequelizeStub.restore();
    });
  });
});