function calculateScore(level, kills, boosted) {
    // Validate.
    if (
        !Number.isFinite(level) ||
        !Number.isFinite(level) ||
        level < 0 ||
        kills < 0
    ) {
        return "Dữ liệu không hợp lệ";
    }
    if (typeof boosted !== "boolean") {
        boosted = false;
    }

    const baseScore = kills * 10;
    const bonusScore = level >= 5 ? baseScore * 0.5 : baseScore * 0.2;
    const finalScore = boosted
        ? (baseScore + bonusScore) * 2
        : baseScore + bonusScore;

    return Math.floor(finalScore);
}
