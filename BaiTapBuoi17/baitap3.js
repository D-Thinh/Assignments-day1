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
