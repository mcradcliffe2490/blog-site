#!/bin/zsh
# Runs the Substack sync and pushes any new or changed posts.
# Run it by hand, or daily through the launchd job described in README.md.
export PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin

cd "${0:A:h}/.." || exit 1
echo "--- $(date '+%Y-%m-%d %H:%M:%S')"

fail() {
  echo "FAILED: $1"
  osascript -e "display notification \"$1\" with title \"Blog sync failed\"" 2>/dev/null
  exit 1
}

# The commit below goes on whatever branch is checked out, so only run on master.
[ "$(git rev-parse --abbrev-ref HEAD)" = master ] || fail "Not on master; skipped."
# Picks up overrides edited on github.com, and keeps the push below a fast-forward.
git pull --quiet --rebase --autostash origin master || fail "Could not update from GitHub."
# Changes nothing; proves GitHub will accept a push before any work is done.
git push --dry-run --quiet origin master || fail "Cannot push to GitHub."

[ -d node_modules ] || npm ci || fail "npm ci failed."
npm run --silent sync
sync_status=$?

# Posts that synced cleanly are still pushed when another one failed.
git add content/posts
if ! git diff --cached --quiet -- content/posts; then
  git commit --quiet -m "Sync posts from Substack" -- content/posts || fail "Commit failed."
  git push --quiet origin master || fail "Push failed."
  echo "Pushed new or changed posts."
fi

[ $sync_status -eq 0 ] || fail "Some posts did not sync. See ~/Library/Logs/blog-site-sync.log"
