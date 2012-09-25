#include <QApplication>
#include <Windows.h>
#include <Psapi.h>
#include <QProcess>
#include <QMessageBox>

using namespace std;

bool isRunning(string pName);
bool __stdcall isServiceRunning(LPCWSTR serviceName);

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    // check mongodb server
    if (! isServiceRunning(L"MongoDB")) {
        QMessageBox::warning(0, "Erreur lors du Démarrage du Base de Donnée", "Ceci n' est pas une Erreur Grave ! La Base de Donnée a été Fermé accidentalement de façon étrange par Windows et le Programme ne peut pas démarrer sans vos données enregistrées .Le problème peut Venir d' une mauvaise configuration du Windows .Veuillez Réinstaller le Logiciel pour redémarrer la Base de Donnée et règler ainsi le Problème : Ne vous inquiétez Pas ! Vos Données seront Conservées .");
        return 0;
    }

    if (isRunning("node.exe")) {
        QMessageBox::information(0, "Information", "Dejà Une instance du Programme est Lancé, Vous Ne pouvez Que Lancer une Seule Instance !");
        return 0;
    }


    QProcess node;
    QString nodeCommand("./data/bin/node.exe --harmony ./data/app.js");

    QProcessEnvironment env = QProcessEnvironment::systemEnvironment();
    env.insert("NODE_ENV", "production"); // Add an environment variable

    node.setProcessEnvironment(env);


    node.execute(nodeCommand);



    if (! node.waitForFinished()) {
        return 0;
    } else {
        return app.exec();
    }

}

bool __stdcall isServiceRunning(LPCWSTR serviceName) {
    SERVICE_STATUS_PROCESS ssStatus;
    DWORD dwBytesNeeded;
    SC_HANDLE servicesManager;
    SC_HANDLE schService;

    // Get a handle to the SCM database.
    servicesManager = OpenSCManager(
        NULL,                    // local computer
        NULL,                    // servicesActive database
        GENERIC_READ);  // full access rights

    if (NULL == servicesManager)
    {
        //qDebug() << QString("OpenSCManager failed (%1)\n").arg(GetLastError());
        return false;
    }

    // Get a handle to the service.
    schService = OpenService(
        servicesManager,         // SCM database
        serviceName,            // name of service
        GENERIC_READ);  // full access

    if (schService == NULL)
    {
        //qDebug() << QString("OpenService failed (%1)\n").arg(GetLastError());
        CloseServiceHandle(servicesManager);
        return false;
    }

    // Check the status in case the service is not stopped.
    if (!QueryServiceStatusEx(
            schService,                     // handle to service
            SC_STATUS_PROCESS_INFO,         // information level
            (LPBYTE) &ssStatus,             // address of structure
            sizeof(SERVICE_STATUS_PROCESS), // size of structure
            &dwBytesNeeded ) )              // size needed if buffer is too small
    {
        //qDebug() << QString("QueryServiceStatusEx failed (%1)\n").arg(GetLastError());
        CloseServiceHandle(schService);
        CloseServiceHandle(servicesManager);
        return false;
    }

    // Check if the service is already running
    if(ssStatus.dwCurrentState != SERVICE_STOPPED && ssStatus.dwCurrentState != SERVICE_STOP_PENDING)
    {
        CloseServiceHandle(schService);
        CloseServiceHandle(servicesManager);
        return true;

    } else {
        CloseServiceHandle(schService);
        CloseServiceHandle(servicesManager);
        return false;
    }




}

bool isRunning(string pName)
{
    unsigned long aProcesses[1024], cbNeeded, cProcesses;
    if(!EnumProcesses(aProcesses, sizeof(aProcesses), &cbNeeded))
        return false;

    cProcesses = cbNeeded / sizeof(unsigned long);
    for(unsigned int i = 0; i < cProcesses; i++)
    {
        if(aProcesses[i] == 0)
            continue;

        HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, aProcesses[i]);
        char buffer[50];
        GetModuleBaseNameA(hProcess, 0, buffer, 50);
        CloseHandle(hProcess);
        if(pName == string(buffer))
            return true;
    }
    return false;
}

