@echo off
setlocal
set "MAVEN=%~dp0tools\apache-maven-3.9.9\bin\mvn.cmd"

if not exist "%MAVEN%" (
  echo Maven was not found in the project tools folder.
  exit /b 1
)

call "%MAVEN%" spring-boot:run
