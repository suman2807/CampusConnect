@echo off
setlocal enabledelayedexpansion

for /L %%d in (1,1,30) do (

    REM choose randomly whether to commit today (about 70% chance)
    set /a doCommit=!random! %% 10
    if !doCommit! LSS 7 (

        REM number of commits today (1 to 3)
        set /a commits=!random! %% 3 + 1

        for /L %%c in (1,1,!commits!) do (

            set day=%%d
            if !day! LSS 10 set day=0!day!

            set /a hour=!random! %% 9 + 10
            set /a min=!random! %% 60

            echo %%d-%%c >> file.txt
            git add .

            set DATE=2025-11-!day! !hour!:!min!:00
            set GIT_AUTHOR_DATE=!DATE!
            set GIT_COMMITTER_DATE=!DATE!

            set /a r=!random! %% 6

            if !r! EQU 0 git commit -m "updated README"
            if !r! EQU 1 git commit -m "improved UI layout"
            if !r! EQU 2 git commit -m "added feature"
            if !r! EQU 3 git commit -m "fixed bug"
            if !r! EQU 4 git commit -m "refactored code"
            if !r! EQU 5 git commit -m "optimized performance"
        )
    )
)