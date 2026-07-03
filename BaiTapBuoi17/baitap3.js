const players = [
    {
        id: 1,
        name: "DragonSlayer",
        scores: [120, 85, 200, 95],
        level: 8,
        badge: "gold",
    },
    { id: 2, name: "NightWolf", scores: [60, 75, 50], level: 5, badge: null },
    {
        id: 3,
        name: "StarQueen",
        scores: [300, 250, 180, 90, 120],
        level: 12,
        badge: "diamond",
    },
    { id: 4, name: "IronFist", scores: [40, 30], level: 2, badge: null },
    {
        id: 5,
        name: "ShadowBlade",
        scores: [150, 200, 175],
        level: 9,
        badge: "silver",
    },
];

// Hàm 1: getTotalScore(player)
function getTotalScore(player) {
    return player.scores.reduce((total, score) => total + score, 0);
}
getTotalScore(players[0]); // 500
getTotalScore(players[1]); // 185
getTotalScore(players[2]); // 940

// Hàm 2: getRanking(players)
function getRanking(players) {
    return players
        .map((player) => ({
            name: player.name,
            totalScore: getTotalScore(player),
            badge: player.badge ?? null,
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((player, index) => ({
            rank: index + 1,
            ...player,
        }));
}
getRanking(players);

// Hàm 3: getTopPlayers(players, n)
function getTopPlayers(players, n) {
    return getRanking(players)
        .slice(0, n)
        .map((player) => player.name);
}
getTopPlayers(players, 3);
// ["StarQueen", "ShadowBlade", "DragonSlayer"]
getTopPlayers(players, 1);
// ["StarQueen"]

// Hàm 4: formatPlayerCard(player)
function formatPlayerCard(player) {
    let bageDisplay;
    if (player.badge === "gold") {
        bageDisplay = "🥇 GOLD";
    } else if (player.badge === "silver") {
        bageDisplay = "🥈 SILVER";
    } else if (player.badge === "diamond") {
        bageDisplay = "💎 DIAMOND";
    } else {
        bageDisplay = " ";
    }
    return `${player.name} | Lv.${player.level} | ${getTotalScore(player)} điểm | ${bageDisplay}`;
}
formatPlayerCard(players[0]);
// "DragonSlayer | Lv.8 | 500 điểm | 🏅 GOLD"

formatPlayerCard(players[1]);
// "NightWolf | Lv.5 | 185 điểm"

formatPlayerCard(players[2]);
// "StarQueen | Lv.12 | 940 điểm | 💎 DIAMOND"
