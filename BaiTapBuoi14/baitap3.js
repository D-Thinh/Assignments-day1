function classifyUser(user) {
    let result = {};
    result.displayName = user.name || "Ẩn danh";
    result.isAdult = user.age >= 18;
    result.hasEmail = !!user.email;
    result.role = user.role ?? "guest";
    // status
    if (user.score >= 80) result.status = "vip";
    else if (user.score >= 50) result.status = "normal";
    else result.status = "new";

    // canAccess
    if (result.isAdult && result.role != "guest") result.canAccess = true;
    else result.canAccess = false;

    return result;
}
