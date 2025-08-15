@echo off

:: Check if Yarn is installed
for /f "tokens=*" %%i in ('yarn -v 2^>nul') do set version_check=%%i

:: If Yarn is not installed, version_check will be empty
if "%version_check%"=="" (
    echo Yarn is not installed. Please install Yarn to proceed. Try 'npm install -g yarn' to install Yarn globally.
    exit /b 1
) else (
    echo Yarn is installed. Proceeding with the script...
    yarn install
    yarn start
    echo Yarn started successfully. Open your browser and navigate to http://localhost:3000 to play TicTacToe.
    exit /b 0
)