@echo off
REM ShopAI Quick Setup Script for Windows

echo.
echo 🚀 ShopAI Production Setup
echo ==========================
echo.

REM Check prerequisites
echo Checking prerequisites...

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git is not installed. Please install from: https://git-scm.com/downloads
    pause
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install from: https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ All prerequisites installed!
echo.

REM Get user information
echo 📝 Setup Configuration
echo =====================
echo.

set /p GITHUB_USERNAME="Enter your GitHub username: "
set /p REPO_NAME="Enter your GitHub repository name (default: shopai): "
if "%REPO_NAME%"=="" set REPO_NAME=shopai

set /p GIT_NAME="Enter your name for git commits: "
set /p GIT_EMAIL="Enter your email for git commits: "

set /p HAS_TOKEN="Do you have a GitHub Personal Access Token? (y/n): "

if /i not "%HAS_TOKEN%"=="y" (
    echo.
    echo ⚠️  You need a GitHub Personal Access Token to push code.
    echo Create one at: https://github.com/settings/tokens
    echo Required scopes: repo, workflow
    echo.
    pause
)

set /p GITHUB_TOKEN="Enter your GitHub Personal Access Token: "

set /p HAS_API_KEY="Do you have an Anthropic API key? (y/n): "

if /i "%HAS_API_KEY%"=="y" (
    set /p ANTHROPIC_KEY="Enter your Anthropic API key: "
) else (
    echo ⚠️  You can add your API key later in Vercel settings
    set ANTHROPIC_KEY=your_api_key_here
)

echo.
echo 🔧 Setting up project...
echo.

REM Initialize git if not already done
if not exist .git (
    echo Initializing git repository...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to initialize git repository
        echo Make sure you are in the shopai-nextjs folder
        echo Current directory: %CD%
        pause
        exit /b 1
    )
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Configure git
echo Configuring git...
git config user.name "%GIT_NAME%"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to configure git username
    pause
    exit /b 1
)

git config user.email "%GIT_EMAIL%"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to configure git email
    pause
    exit /b 1
)
echo ✅ Git configured

REM Create .env.local for local development
(
echo ANTHROPIC_API_KEY=%ANTHROPIC_KEY%
echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
) > .env.local

echo ✅ Created .env.local for local development

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Add all files to git
git add .

REM Create initial commit if needed
git rev-parse HEAD >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    git commit -m "Initial commit - ShopAI platform"
    echo ✅ Initial commit created
)

REM Set up remote
git remote remove origin >nul 2>nul
git remote add origin https://%GITHUB_TOKEN%@github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo ✅ Git remote configured

REM Push to GitHub
echo.
echo 📤 Pushing to GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to push to GitHub. Please check your token and repository name.
    pause
    exit /b 1
)

echo ✅ Code pushed to GitHub successfully!

REM Test local build
echo.
echo 🏗️  Testing build...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
) else (
    echo ⚠️  Build failed. Please check for errors above.
)

REM Final instructions
echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo Your code is now on GitHub: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
echo Next steps:
echo 1. Go to https://vercel.com/new
echo 2. Import your repository: %REPO_NAME%
echo 3. Add environment variable:
echo    ANTHROPIC_API_KEY=%ANTHROPIC_KEY%
echo    NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
echo 4. Click Deploy!
echo.
echo To test locally:
echo   npm run dev
echo.
echo To deploy changes:
echo   git add .
echo   git commit -m "your message"
echo   git push
echo.
echo Happy coding! 🚀
echo.
pause
