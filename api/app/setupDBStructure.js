import sequelize from './models/index.js';

export default async function(reset = false) {
  let dropTables = "";
  if (reset) {
    dropTables = "DROP TABLE players; DROP TABLE matches;";
  }
  sequelize.query(`
    CREATE TABLE IF NOT EXISTS teams (
      id NUMERIC UNIQUE,
      name VARCHAR(30),
      PRIMARY KEY ("id")
    );
    INSERT INTO teams(id,name) SELECT 97,'Barcelona'
      WHERE NOT EXISTS (SELECT id FROM teams WHERE id = 97);
    INSERT INTO teams(id,name) SELECT 73,'Atletico Madrid'
      WHERE NOT EXISTS (SELECT id FROM teams WHERE id = 73);

    ${dropTables}
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL,
      key VARCHAR(10) UNIQUE,
      team_id NUMERIC REFERENCES teams,
      name VARCHAR(50),
      number NUMERIC,
      matches NUMERIC,
      type VARCHAR(20),
      age NUMERIC,
      rating NUMERIC,
      PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS matches (
        id SERIAL,
        key VARCHAR(10) UNIQUE,
        team_id integer REFERENCES teams,
        country VARCHAR(50),
        league VARCHAR(50),
        date VARCHAR(50),
        status VARCHAR(50),
        match_time VARCHAR(20),
        home_score NUMERIC,
        away_score NUMERIC,
        PRIMARY KEY ("id")
    );`
  ).then(response => {
    console.log("DB setup ran successfully:");
  }, error => {
    console.log("DB setup failed:");
    console.log(error);
  });
}