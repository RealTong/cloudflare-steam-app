import SteamClient from "./utils/steam";

async function main() {
  const steamClient = new SteamClient(
    "",
    "",
    ""
  );
  const twofaCode = await steamClient.get2FACode();
  console.log(twofaCode);

  const myInfo = await steamClient.getMyInfo();
  console.log(myInfo);

  const myGames = await steamClient.getMyGames();
  console.log(myGames);
}

main();