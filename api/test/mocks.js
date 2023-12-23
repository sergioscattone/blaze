const mockMatches = [{
  match_id: 'mocked-match-id',
  country_name: 'country_name',
  league_name: 'league_name',
  match_date: 'match_date',
  match_status: 'match_status',
  match_time: 'match_time',
  match_hometeam_score: 'match_hometeam_score',
  match_awayteam_score: 'match_awayteam_score'
}, {
  match_id: 'mocked-match-id-2',
  country_name: 'country_name 2',
  league_name: 'league_name 2',
  match_date: 'match_date 2',
  match_status: 'match_status 2',
  match_time: 'match_time 2',
  match_hometeam_score: 'match_hometeam_score 2',
  match_awayteam_score: 'match_awayteam_score 2'
}];

const mockPlayers = [{
  players: [{
    player_key: 'mocked-player-id',
    player_name: 'player_name',
    player_number: 'player_number',
    player_match_played: 'player_match_played',
    player_type: 'player_type',
    player_age: 'player_age',
    player_rating: 'player_rating',
  }, {
    player_key: 'mocked-player-id 2',
    player_name: 'player_name 2',
    player_number: 'player_number 2',
    player_match_played: 'player_match_played 2',
    player_type: 'player_type 2',
    player_age: 'player_age 2',
    player_rating: 'player_rating 2',
  }]
}];
export { mockMatches, mockPlayers };