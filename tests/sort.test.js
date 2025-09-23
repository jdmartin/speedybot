import assert from "node:assert";

/**
 * Sort Discord names by their first alphanumeric character.
 *
 * Assumptions:
 *  - Every name contains at least one alphanumeric character (safe under Discord username/display name rules).
 *  - Sorting is case-insensitive.
 *  - Leading punctuation (like '.' or '_') is ignored when breaking ties.
 *
 * This works correctly for:
 *  - Usernames (a-z, 0-9, '_' and '.')
 *  - Display names with Latin letters, digits, punctuation, or other Unicode characters
 *    (names starting with emojis or non-Latin characters will sort naturally via localeCompare).
 */

function alnumSort(a, b) {
    function firstAlnum(str) {
        const match = str.match(/[a-z0-9]/i);
        return match[0].toLowerCase(); // assume at least one exists
    }

    function stripLeadingNonAlnum(str) {
        return str.replace(/^[^a-z0-9]+/i, "");
    }

    const aFirst = firstAlnum(a);
    const bFirst = firstAlnum(b);

    if (aFirst < bFirst) return -1;
    if (aFirst > bFirst) return 1;

    // tie-breaker: compare full name ignoring leading punctuation and case
    return stripLeadingNonAlnum(a).toLowerCase().localeCompare(stripLeadingNonAlnum(b).toLowerCase());
}

// --- test cases ---
function runTests() {
    // basic ordering
    assert.deepStrictEqual(
        ["@bob", "alice", ".Alice", "_charlie", "Zara"].toSorted(alnumSort),
        ["alice", ".Alice", "@bob", "_charlie", "Zara"]
    );

    // case-insensitive compare
    assert.deepStrictEqual(
        ["bob", "Alice", "alice"].toSorted(alnumSort),
        ["Alice", "alice", "bob"]
    );

    // mixed leading punctuation
    assert.deepStrictEqual(
        ["!zack", "#andy", ".Alice"].toSorted(alnumSort),
        [".Alice", "#andy", "!zack"]
    );

    console.log("✅ all alnumSort tests passed!");
}

runTests();
