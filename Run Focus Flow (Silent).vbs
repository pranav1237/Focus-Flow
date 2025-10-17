Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

' Determine the project directory (folder of this script)
projectDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = projectDir

' Run dev server hidden and open browser. WindowStyle=0 hides the console.
cmd = "cmd /c npm install --no-audit --no-fund && npm run dev -- --host --open"
shell.Run cmd, 0, False


