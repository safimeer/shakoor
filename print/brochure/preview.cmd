@echo off
rem Renders 300 DPI PNG previews of the brochure (with fold/trim guides).
rem Page = 426 x 303 mm (420 x 297 + 3 mm bleed) = 1610 x 1145 CSS px; x3.125 = 300 DPI.
setlocal
set "HERE=%~dp0"
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
for %%P in (outside inside proof) do (
  "%CHROME%" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars ^
    --window-size=1610,1145 --force-device-scale-factor=3.1252 ^
    --screenshot="%HERE%preview-%%P.png" "file:///%HERE:\=/%%%P.html"
)
endlocal
