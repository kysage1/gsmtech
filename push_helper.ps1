param(
  [string]$remote = 'https://github.com/swaju3/gsmtechnology.git',
  [string]$branch = 'main'
)
Write-Host "This helper will add remote (if missing) and push the current branch to $remote/$branch"
cd $PSScriptRoot
if (-not (git remote get-url origin 2>$null)) {
  git remote add origin $remote
} else {
  Write-Host "Remote 'origin' already exists:"; git remote get-url origin
}
git branch -M $branch
git push -u origin $branch

Write-Host 'Push complete (or failed). Use your preferred auth method (SSH or HTTPS PAT when prompted).'
