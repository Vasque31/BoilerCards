#include <stdio.h>
#include <stdlib.h>

#include <netinet/in.h>
#include <netdb.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>


//await for cliet
//implement concurrency support later
//might find better solution to replace with later
void serverConnect();
void communicationLoop();

        //Based on CS252 lab5: http server
void serverConnect() {

        struct sockaddr_in serverIPAddress;

        memset( &serverIPAddress, 0, sizeof(serverIPAddress));
        serverIPAddress.sin_family = AF_INET;
        serverIPAddress.sin_addr.s_addr = INADDR_ANY;
        serverIPAddress.sin_port = htons(80); // 80 for default http port




        //return conn;

}


int main(int argc, char **argv) {

        serverConnect();

}