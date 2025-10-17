Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

' Determine the project directory (folder of this script)
projectDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = projectDir

' Open a visible console, install deps, then start Vite and keep the window open
cmd = "cmd /k npm install --no-audit --no-fund && npm run dev -- --host --open"
shell.Run cmd, 1, False


