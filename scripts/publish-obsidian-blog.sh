#!/bin/zsh

set -u

user_root="${HOME:?无法确定当前用户目录}"
source_dir="${OBSIDIAN_BLOG_DIR:-$user_root/Nutstore Files/ObsidianVault/Blog}"
repo_dir="${OBSIDIAN_PUBLISH_REPO:-$user_root/Library/Application Support/rndyt-blog-publisher/site}"
script_dir="${0:A:h}"
sync_script="$script_dir/sync-obsidian-blog.mjs"
lock_dir="/tmp/rndyt-obsidian-blog-sync.lock"
ssh_command="ssh -o Hostname=ssh.github.com -p 443 -o BatchMode=yes -o ConnectTimeout=15"

if ! mkdir "$lock_dir" 2>/dev/null; then
  existing_pid=""
  [[ -r "$lock_dir/pid" ]] && read -r existing_pid < "$lock_dir/pid"
  if [[ "$existing_pid" == <-> ]] && kill -0 "$existing_pid" 2>/dev/null; then
    exit 0
  fi
  rm -f "$lock_dir/pid"
  rmdir "$lock_dir" 2>/dev/null || exit 1
  mkdir "$lock_dir" || exit 1
fi
print -r -- "$$" > "$lock_dir/pid"

cleanup() {
  rm -f "$lock_dir/pid"
  rmdir "$lock_dir" 2>/dev/null
}
trap cleanup EXIT
trap 'exit 143' HUP INT TERM

cd "$repo_dir" || exit 1

current_branch="$(git branch --show-current)"
if [[ "$current_branch" != "main" ]]; then
  print -u2 "未发布：后台发布副本当前位于 $current_branch 分支。"
  exit 1
fi

GIT_TERMINAL_PROMPT=0 GIT_SSH_COMMAND="$ssh_command" git fetch origin main || exit 1

read behind ahead <<< "$(git rev-list --left-right --count origin/main...main)"
if (( ahead > 0 )); then
  if (( behind > 0 )); then
    git rebase origin/main || exit 1
  fi
  GIT_TERMINAL_PROMPT=0 GIT_SSH_COMMAND="$ssh_command" git push origin main || exit 1
elif (( behind > 0 )); then
  git merge --ff-only origin/main || exit 1
fi

OBSIDIAN_BLOG_DIR="$source_dir" \
  OBSIDIAN_BLOG_DEST="$repo_dir/src/content/blog" \
  node "$sync_script" || exit 1

if [[ -z "$(git status --porcelain -- src/content/blog)" ]]; then
  exit 0
fi

if [[ ! -x node_modules/.bin/astro ]]; then
  npm ci || exit 1
fi
npm run check || exit 1
git add -A -- src/content/blog
git commit -m "content: sync Obsidian blog" -- src/content/blog || exit 1
GIT_TERMINAL_PROMPT=0 GIT_SSH_COMMAND="$ssh_command" git push origin main
