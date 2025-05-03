import { getAuthCode } from "./2fa";
import {
  formatMinutesToFriendlyString,
  formatTimestampToDateTime,
} from "./format";
import { 
  IGame, 
  ISteamUser, 
  SteamPlayerSummaryResponse, 
  SteamOwnedGamesResponse,
  SteamOwnedGame
} from "../types";

class SteamClient {
  constructor(apiKey: string, setupCode: string, steamID: string) {
    this.apiKey = apiKey;
    this.setupCode = setupCode;
    this.steamID = steamID;
  }

  apiKey: string;
  setupCode: string;
  steamID: string;

  async getMyInfo(): Promise<ISteamUser> {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${this.steamID}&language=schinese`;
    
    const response = await fetch(url);
    const data = await response.json() as SteamPlayerSummaryResponse;
    const playerData = data.response.players[0];
    
    return {
      steamID: playerData.steamid,
      nickname: playerData.personaname,
      createdTime: formatTimestampToDateTime(playerData.timecreated ?? 0),
    };
  }

  async getMyGames(limit: number = 5): Promise<IGame[]> {
    // Get owned games with details
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.apiKey}&steamid=${this.steamID}&format=json&include_appinfo=true&include_played_free_games=true&language=schinese`;
    
    const response = await fetch(url);
    const data = await response.json() as SteamOwnedGamesResponse;
    const games = data.response.games || [];
    
    return games
      .sort((a: SteamOwnedGame, b: SteamOwnedGame) => b.playtime_forever - a.playtime_forever)
      .slice(0, limit)
      .map((game: SteamOwnedGame) => {
        return {
          id: game.appid,
          name: game.name,
          playtime: formatMinutesToFriendlyString(game.playtime_forever),
          lastPlayedTimestamp: formatTimestampToDateTime(game.rtime_last_played ?? 0),
        };
      });
  }

  get2FACode() {
    return getAuthCode(this.setupCode);
  }
}

export default SteamClient;
