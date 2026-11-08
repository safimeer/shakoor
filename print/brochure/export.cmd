@echo off
rem Final export of the brochure (run after: set PREVIEW=0 && node build.cjs).
rem  - Print PDF: 2 pages, 426 x 303 mm each (420 x 297 trim + 3 mm bleed), fonts embedded.
rem  - PNGs: 300 DPI flat sides without guides, plus the folding proof.
setlocal
set "HERE=%~dp0"
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "BASE=file:///%HERE:\=/%"
set "FLAGS=--headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars"
"%CHROME%" --headless=new --disable-gpu --allow-file-access-from-files --no-pdf-header-footer --print-to-pdf="%HERE%SHAKOOR_Brochure_ZFold_420x297_Print_Ready.pdf" "%BASE%print.html"
"%CHROME%" --headless=new --disable-gpu --allow-file-access-from-files --no-pdf-header-footer --print-to-pdf="%HERE%SHAKOOR_Brochure_Folding_Proof.pdf" "%BASE%proof.html"
"%CHROME%" %FLAGS% --window-size=1610,1145 --force-device-scale-factor=3.1252 --screenshot="%HERE%SHAKOOR_Brochure_Outside_300dpi.png" "%BASE%outside.html"
"%CHROME%" %FLAGS% --window-size=1610,1145 --force-device-scale-factor=3.1252 --screenshot="%HERE%SHAKOOR_Brochure_Inside_300dpi.png" "%BASE%inside.html"
"%CHROME%" %FLAGS% --window-size=1610,1145 --force-device-scale-factor=3.1252 --screenshot="%HERE%SHAKOOR_Brochure_Folding_Proof.png" "%BASE%proof.html"
endlocal
