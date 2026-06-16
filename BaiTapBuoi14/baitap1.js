function analyzeValue(value) {
    let result = {};
    result.input = value;
    result.type = typeof value;
    result.isTruthy = Boolean(value);
    result.isNullOrUndefined = value == null ? true : false;
    result.isReferenceType =
        (typeof value === "object" && value !== null) ||
        typeof value === "function";
    return result;
}

analyzeValue(null);
analyzeValue(undefined);
analyzeValue(0);
analyzeValue("hello");
analyzeValue([1, 2, 3]);
analyzeValue({});
analyzeValue(function () {});
analyzeValue(NaN);
