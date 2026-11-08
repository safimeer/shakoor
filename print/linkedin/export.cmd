@echo off
rem Exports the SHAKOOR LinkedIn images. Run "node build.cjs" first.
setlocal
set "HERE=%~dp0"
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "BASE=file:///%HERE:\=/%"
set "FLAGS=--headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars --force-device-scale-factor=2"

"%CHROME%" %FLAGS% --window-size=400,400 --screenshot="%HERE%SHAKOOR_LinkedIn_Logo.png" "%BASE%logo.html"
"%CHROME%" %FLAGS% --window-size=1128,191 --screenshot="%HERE%SHAKOOR_LinkedIn_Banner.png" "%BASE%banner.html"
endlocal
