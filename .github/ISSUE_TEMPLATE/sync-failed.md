---
title: Sync Failed for PR #{{ env.PR_NUMBER }}
labels: sync-failed
assignees: { { env.PR_AUTHOR } }
---

## Sync Failed

The GitHub Action failed to sync changes from PR #{{ env.PR_NUMBER }} to the ddn-docs repository.

**Original PR:** {{ env.PR_URL }}  
**Original Author:** @{{ env.PR_AUTHOR }}

### Error Details

The patch could not be applied to the ddn-docs repository. This might be due to significant differences between the
repositories or conflicting changes.

### Next Steps

1. Manually review the changes in the original PR
2. Apply the relevant changes to the ddn-docs repository
3. Create a PR in the ddn-docs repository

Please investigate why the synchronization failed and make the necessary changes manually.
