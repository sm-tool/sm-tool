@echo off
setlocal enabledelayedexpansion

:: Set these variables according to your environment
set DOCKER_CONTAINER=postgresql_master
set POSTGRES_USER=smt
set POSTGRES_PASSWORD=1234
set DATABASE_NAME=db
set SQL_FOLDER_PATH=.\scripts

:: Create a temporary directory in the container
echo Creating temporary directory in Docker container...
docker exec %DOCKER_CONTAINER% mkdir -p /tmp/sql_scripts

if %errorlevel% neq 0 (
    echo Failed to create temporary directory in container.
    exit /b %errorlevel%
)

:: Copy the SQL folder to the Docker container
echo Copying SQL scripts to Docker container...
docker cp "%SQL_FOLDER_PATH%\." %DOCKER_CONTAINER%:/tmp/sql_scripts

if %errorlevel% neq 0 (
    echo Failed to copy SQL scripts to container.
    exit /b %errorlevel%
)

:: Execute each SQL file in the PostgreSQL database
docker exec -e PGPASSWORD=%POSTGRES_PASSWORD% %DOCKER_CONTAINER% /bin/bash -c "for file in /tmp/sql_scripts/*.sql; do echo '=========================================='; first_line=$(head -n 1 $file); if [[ $first_line == --* ]]; then echo 'Message:' ${first_line#--}; fi; echo '=========================================='; psql -U %POSTGRES_USER% -d %DATABASE_NAME% -q -f $file; echo; done"

if %errorlevel% neq 0 (
    echo Failed to execute SQL scripts.
    goto cleanup
)

echo All SQL scripts executed successfully.

:cleanup
:: Remove the temporary directory from the container
echo Removing temporary directory from container...
docker exec %DOCKER_CONTAINER% /bin/bash -c "rm -rf /tmp/sql_scripts && echo Cleanup successful || echo Cleanup failed"

echo Process completed.
exit /b %errorlevel%