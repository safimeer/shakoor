@echo off
rem Exports the SHAKOOR business card. Run "node build.cjs" first.
rem  - PNGs: 96 x 60 mm (90 x 54 trim + 3 mm bleed) at 300 DPI = 1134 x 709 px.
rem  - PDF: 2 pages (front, back), 96 x 60 mm, vector text with embedded fonts.
setlocal
set "HERE=%~dp0"
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "BASE=file:///%HERE:\=/%"
set "FLAGS=--headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars"

rem 96 x 60 mm at 300 DPI = 1134 x 709 px (rendered 1:1).
"%CHROME%" %FLAGS% --window-size=1134,709 --force-device-scale-factor=1 --screenshot="%HERE%SHAKOOR_Business_Card_Front.png" "%BASE%card-front.html"
"%CHROME%" %FLAGS% --window-size=1134,709 --force-device-scale-factor=1 --screenshot="%HERE%SHAKOOR_Business_Card_Back.png" "%BASE%card-back.html"
"%CHROME%" %FLAGS% --window-size=1600,1000 --force-device-scale-factor=1.5 --screenshot="%HERE%SHAKOOR_Business_Card_Preview.png" "%BASE%card-preview.html"
"%CHROME%" --headless=new --disable-gpu --allow-file-access-from-files --no-pdf-header-footer --print-to-pdf="%HERE%SHAKOOR_Business_Card_Print_Ready.pdf" "%BASE%card-print.html"
endlocal
