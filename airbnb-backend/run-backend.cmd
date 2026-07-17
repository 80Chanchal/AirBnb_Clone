@echo off
setlocal
set "MAVEN=%~dp0mvnw.cmd"

if not exist "%MAVEN%" (
  set "MAVEN=%~dp0tools\apache-maven-3.9.9\bin\mvn.cmd"
)

if not exist "%MAVEN%" (
  echo Maven was not found. Install Maven or use the included mvnw wrapper.
  exit /b 1
)

call "%MAVEN%" spring-boot:run
