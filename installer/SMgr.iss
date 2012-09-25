; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{6885DB1E-D3D5-4685-9D98-C1F2DB80362C}
AppName=Studies Intelligence
AppVersion=1.0
AppVerName=Studies Intelligence 1.0
AppPublisher=DIDI, Inc.
AppPublisherURL=http://www.facebook.com/CEO.DIDI
AppSupportURL=http://www.facebook.com/CEO.DIDI
AppUpdatesURL=http://www.facebook.com/CEO.DIDI
DefaultDirName={pf}\DIDI\Studies Intelligence
DefaultGroupName=Studies Intelligence
LicenseFile=C:\Users\DIDI\Desktop\License.txt
OutputDir=D:\lab\smgr 0.1\installer
OutputBaseFilename=Studies_Intelligence_1.0_Setup
SetupIconFile=D:\lab\smgr 0.1\graphics\SMgr.ico
Compression=lzma
SolidCompression=yes
ChangesEnvironment=yes
AllowCancelDuringInstall=yes
AlwaysRestart=yes
WizardImageFile=D:\lab\smgr 0.1\graphics\WizardImage.bmp
WizardSmallImageFile=D:\lab\smgr 0.1\graphics\WizardSmallImage.bmp
WizardImageBackColor=clWhite
ChangesAssociations=yes

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 0,6.1

[Files]
Source: "D:\lab\smgr 0.1\Studies_Intelligence.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "D:\lab\smgr 0.1\data\*"; DestDir: "{app}\data"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "D:\lab\smgr 0.1\7zip\*"; DestDir: "{app}\7zip"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "D:\lab\smgr 0.1\mongodb\*"; DestDir: "{app}\mongodb"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "D:\lab\smgr 0.1\msvcp100.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "D:\lab\smgr 0.1\msvcr100.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "D:\lab\smgr 0.1\graphics\arabswell_1.ttf"; DestDir: "{fonts}"; Flags: onlyifdoesntexist uninsneveruninstall; FontInstall: "arabswell_1"
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Dirs]
Name: "{commonappdata}\DIDI\Studies_Intelligence"
Name: "{app}\db"


[Icons]
Name: "{group}\Studies Intelligence"; Filename: "{app}\Studies_Intelligence.exe"
Name: "{group}\{cm:ProgramOnTheWeb,Studies Intelligence}"; Filename: "http://www.facebook.com/CEO.DIDI"
Name: "{group}\{cm:UninstallProgram,Studies Intelligence}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\Studies Intelligence"; Filename: "{app}\Studies_Intelligence.exe"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\Studies Intelligence"; Filename: "{app}\Studies_Intelligence.exe"; Tasks: quicklaunchicon


[Run]
Filename: "{app}\mongodb\bin\mongod.exe"; Description: "{cm:LaunchProgram,Studies Intelligence}"; StatusMsg: "Installation de Base de Donn�e..."; Parameters: "--install --logpath ./didi.log --logappend --dbpath ""{commonappdata}\DIDI\Studies_Intelligence"""; Flags: waituntilterminated skipifsilent runhidden
Filename: "{sys}\net.exe"; Description: "Diid"; Parameters: "start MongoDB"; StatusMsg: "D�marrage de Base de Donn�e..."; Flags: waituntilterminated skipifdoesntexist runhidden

[UninstallRun]
Filename: "{app}\mongodb\bin\mongod.exe"; Parameters: "--remove"; Flags: waituntilterminated

[Registry]
Root: HKCR; Subkey: ".SMgr"; ValueType: string; ValueName: ""; ValueData: "SMgrDataFile"; Flags: uninsdeletevalue
Root: HKCR; Subkey: "SMgrDataFile"; ValueType: string; ValueName: ""; ValueData: "Fichier Donn�es Studies Intelligence"; Flags: uninsdeletekey
Root: HKCR; Subkey: "SMgrDataFile\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\Studies_Intelligence.exe,0"