#!/bin/bash
# Watches for changes from collaborators and auto-pulls when new commits arrive.

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
POLL_SECONDS=30
LAST_COMMIT=""

cd "$REPO_DIR"

echo "👀  Watching for changes from collaborators..."
echo "    Checking every ${POLL_SECONDS}s — press Ctrl+C to stop."
echo ""

while true; do
  # Fetch silently
  git fetch origin --quiet 2>/dev/null

  REMOTE_COMMIT=$(git rev-parse origin/main 2>/dev/null)
  LOCAL_COMMIT=$(git rev-parse HEAD 2>/dev/null)

  if [ -z "$LAST_COMMIT" ]; then
    LAST_COMMIT="$LOCAL_COMMIT"
  fi

  if [ "$REMOTE_COMMIT" != "$LOCAL_COMMIT" ]; then
    AUTHOR=$(git log origin/main -1 --format="%an" 2>/dev/null)
    MESSAGE=$(git log origin/main -1 --format="%s" 2>/dev/null)
    TIME=$(git log origin/main -1 --format="%ar" 2>/dev/null)

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔔  New change detected!"
    echo "    Author:  $AUTHOR"
    echo "    Message: $MESSAGE"
    echo "    Time:    $TIME"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Check for local uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
      echo "⚠️   You have local unsaved changes — stashing them first..."
      git stash push -q -m "auto-stash before pulling $(date '+%H:%M:%S')"
      STASHED=true
    else
      STASHED=false
    fi

    # Pull
    if git merge --ff-only origin/main --quiet 2>/dev/null; then
      echo "✅  Pulled successfully. You're up to date."
    else
      echo "⚠️   Fast-forward not possible. Merging..."
      git merge origin/main --no-edit --quiet 2>/dev/null && echo "✅  Merged successfully." || echo "❌  Merge conflict — check your files."
    fi

    # Re-apply stash if we stashed
    if [ "$STASHED" = true ]; then
      git stash pop --quiet 2>/dev/null && echo "✅  Your local changes restored." || echo "⚠️   Could not restore stash — run 'git stash pop' manually."
    fi

    echo ""
    LAST_COMMIT="$REMOTE_COMMIT"

    # macOS desktop notification
    osascript -e "display notification \"$AUTHOR pushed: $MESSAGE\" with title \"RoomGlow Update 🏠\"" 2>/dev/null
  fi

  sleep "$POLL_SECONDS"
done
