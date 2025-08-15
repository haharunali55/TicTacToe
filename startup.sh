#!/bin/sh

#if yarn command is not found/recognized, version_check will be empty.
#"yarn: command not found" will not be stored in version_check as it is a stderr message and not stdout.
#To catch stderr, we can redirect it to stdout using 2>&1.
#That is, version_checl="$(yarn -v 2>&1)" 
version_check="$(yarn -v)"
echo $version_check
if [ -z "$version_check" ]; then
  echo "Yarn is not installed. Please install Yarn to proceed. Try 'npm install -g yarn' to install Yarn globally."
  exit 1
else
  echo "Yarn is installed. Proceeding with the script..."
  yarn install
  yarn start
  echo "Yarn started successfully. Open your browser and navigate to http://localhost:3000 to play TicTacToe."
  exit 0
fi