#!/bin/bash
echo "Please enter alias of the environment that you want to deploy to"
read aliasInput
sfdx force:source:deploy -p force-app/main/default  -u $aliasInput