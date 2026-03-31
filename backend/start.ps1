$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$env:JAVA_HOME="$PSScriptRoot\jdk-21.0.2"
$env:DB_URL='jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true&serverTimezone=UTC'
$env:DB_USERNAME='2CX5dYVXxEY8CVP.root'
$env:DB_PASSWORD='FLbz6SbBeuNb790R'
mvn spring-boot:run
