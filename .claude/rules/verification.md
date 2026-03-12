# Change Verification Protocol

**After multi-file changes, pattern replacements, or schema changes - complete this checklist.**

## Verification Checklist

### 1. Change Log
```
Files changed: [list paths]
What: [brief description]
Why: [rationale]
```

### 2. Completeness Search
- Run `Grep` to find ALL occurrences of the pattern you changed
- Report: "Found X, changed Y, skipped Z because..."
- If skipped any, explain why

### 3. Impact Check
State what MIGHT be affected:
- Tests needing updates?
- Docs now outdated?
- Config changes needed?

### 4. Confidence Level
End with: "HIGH confidence" or "MEDIUM confidence - [uncertainty]"

## When to Skip
- Single-line typo fixes
- New isolated features (not touching existing code)
- Documentation-only changes

## Red Flags (Stop and Tell User)
- "Found 10 instances but only changed 3"
- "This affects database schema"
- "Found 3 different patterns doing the same thing"
- "Can't verify completeness"
