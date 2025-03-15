#!/bin/bash

# Script to check if the Git repository is correctly configured
# to push to https://github.com/DmitrySuccessful/Mart

echo "Checking Git repository configuration..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "ERROR: No Git remote named 'origin' found!"
    echo "Please set up the remote with:"
    echo "git remote add origin https://github.com/DmitrySuccessful/Mart.git"
    exit 1
fi

if [ "$REMOTE_URL" != "https://github.com/DmitrySuccessful/Mart.git" ]; then
    echo "WARNING: Repository is NOT configured correctly!"
    echo "Current remote URL: $REMOTE_URL"
    echo "Expected remote URL: https://github.com/DmitrySuccessful/Mart.git"
    echo ""
    echo "To fix this, run the following commands:"
    echo "git remote remove origin"
    echo "git remote add origin https://github.com/DmitrySuccessful/Mart.git"
    exit 1
else
    echo "SUCCESS: Repository is correctly configured to push to Mart!"
    echo "Remote URL: $REMOTE_URL"
fi

# Check if there are any other remotes that might cause confusion
OTHER_REMOTES=$(git remote | grep -v "^origin$")
if [ -n "$OTHER_REMOTES" ]; then
    echo ""
    echo "NOTE: You have other remotes configured:"
    for remote in $OTHER_REMOTES; do
        remote_url=$(git remote get-url $remote)
        echo "  - $remote: $remote_url"
    done
    echo "Be careful not to push to these remotes by mistake."
fi

exit 0 