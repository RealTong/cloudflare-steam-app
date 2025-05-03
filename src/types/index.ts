export interface ISteamUser {
  steamID: string;
  nickname: string;
  createdTime: string;
}

export interface IGame {
  id: number;
  name: string;
  playtime: string;
  lastPlayedTimestamp: string;
}

// Steam API Response Types
export interface SteamPlayerSummary {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  commentpermission: number;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  primaryclanid: string;
  timecreated: number;
  personastateflags: number;
  loccountrycode: string;
}

export interface SteamPlayerSummaryResponse {
  response: {
    players: SteamPlayerSummary[];
  };
}

export interface SteamOwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
  rtime_last_played: number;
  content_descriptorids?: number[];
  playtime_disconnected?: number;
  playtime_2weeks?: number;
}

export interface SteamOwnedGamesResponse {
  response: {
    game_count: number;
    games: SteamOwnedGame[];
  };
}
