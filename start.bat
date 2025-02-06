@echo off
cd /d python-backend
call venv\Scripts\activate
start cmd /k "python app.py"
timeout /t 5 >nul

cd ../react-frontend
start cmd /k "npm start"
timeout /t 10 >nul

cd ..
start cmd /k "npm run electron"
