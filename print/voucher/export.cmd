@echo off
rem Exports the flyer from voucher.html.
rem  - Print PDF: 303 x 216 mm (A4 landscape + 3 mm bleed), fonts embedded.
rem  - PNG preview: 300 DPI (3579 x 2551 px), including the bleed.
setlocal
set "HERE=%~dp0"
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "SRC=file:///%HERE:\=/%voucher.html"

"%CHROME%" --headless=new --disable-gpu --allow-file-access-from-files --no-pdf-header-footer ^
  --print-to-pdf="%HERE%SHAKOOR_Corporate_Marketing_Voucher_Print.pdf" "%SRC%"

rem 303 mm = 1145.2 CSS px and 216 mm = 816.4 CSS px; x3.125 = 300 DPI.
"%CHROME%" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars ^
  --window-size=1145,816 --force-device-scale-factor=3.1252 ^
  --screenshot="%HERE%SHAKOOR_Corporate_Marketing_Voucher_Preview.png" "%SRC%"
endlocal
