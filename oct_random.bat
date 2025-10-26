@echo off
setlocal enabledelayedexpansion

for /L %%i in (1,1,20) do (

    set /a day=!random! %% 31 + 1
    if !day! lss 10 set day=0!day!

    set /a hour=!random! %% 9 + 10
    set /a min=!random! %% 60

    echo %%i >> file.txt
    git add .

    set DATE=2025-10-!day! !hour!:!min!:00
    set GIT_AUTHOR_DATE=!DATE!
    set GIT_COMMITTER_DATE=!DATE!

    REM random messages manually
    set /a r=!random! %% 5

    if !r! EQU 0 git commit -m "updated README"
    if !r! EQU 1 git commit -m "improved UI layout"
    if !r! EQU 2 git commit -m "added feature"
    if !r! EQU 3 git commit -m "fixed bug"
    if !r! EQU 4 git commit -m "refactored code"
)