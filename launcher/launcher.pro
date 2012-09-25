TEMPLATE = app
TARGET = Studies_Intelligence
VERSION = 1.0.0
CONFIG += embed_manifest_exe
# Input
HEADERS += version.h
SOURCES += main.cpp \
    main.cpp

ICON = icons/SMgr.icns

win32 {
    RC_FILE = win_resources.rc
}

LIBS += -L./ -lkernel32
LIBS += -L./ -lpsapi
LIBS += -L./ -ladvapi32
