const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initialize = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};

initialize();

//1. get all
app.get("/players/", async (request, response) => {
  const getplayers = `
      select
          *
       from
          cricket_team
       order by 
          player_id
    `;
  const playerarr = await db.all(getplayers);
  response.send(playerarr);
});

//2. post
app.use(express.json());
app.post("/players/", async (request, response) => {
  const details = request.body;
  const { player_name, jersey_number, role } = details;
  const add = `
       insert into 
           cricket_team(player_name,jersey_number,role)
       values
           ('${player_name}','${jersey_number}','${role}')
    `;
  const dbpostresponse = await db.run(add);
  response.send("Player Added to team");
});

//3. specific player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getplayers = `
      select
          *
       from
          cricket_team
        where
           player_id = ${playerId}
       

    `;
  const playerarr = await db.get(getplayers);
  response.send(playerarr);
});

//4. update
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const details = request.body;
  const { player_name, jersey_number, role } = details;
  const add = `
       update 
           cricket_team 
       set
          player_name = '${player_name}',
          jersey_number = ${jersey_number},
          role = '${role}'
        where 
           player_id = ${playerId}
    `;
  const dbpostresponse = await db.run(add);
  response.send("Player Details Updated");
});

//5.Delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const del = `
        delete from 
           cricket_team 
        where 
           player_id = ${playerId}
    `;
  const dbpostresponse = await db.run(del);
  response.send("Player Removed");
});
module.exports = app;
