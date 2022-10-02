#include <stdio.h>
#include <stdlib.h>

#include <netinet/in.h>
#include <netdb.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>

#include <fcntl.h>
#include <sys/stat.h>

#define TRUE 1
#define FALSE 0

//await for cliet
//implement concurrency support later
//might find better solution to replace with later
int serverConnect();
void communicationLoop(int connection);

int sent = 0; //VAR for testing

        //Based on CS252 lab5: http server
char *readFile(int, int *);     //fd,
void writeDocument(int, char *);
void sendHdr(int client,char * doc);


int serverConnect() {

        struct sockaddr_in serverIPAddress;

        memset( &serverIPAddress, 0, sizeof(serverIPAddress));
        serverIPAddress.sin_family = AF_INET;
        serverIPAddress.sin_addr.s_addr = INADDR_ANY;
        serverIPAddress.sin_port = htons(14253); //  for default http port

        int masterSocket = socket(PF_INET, SOCK_STREAM, 0);
    if ( masterSocket < 0) {
      perror("socket");
      exit( -1 );
    }

    // Set socket options to reuse port. Otherwise we will
    // have to wait about 2 minutes before reusing the sae port number

    int optval = 1;
    int err = setsockopt(masterSocket, SOL_SOCKET, SO_REUSEADDR,
                         (char *) &optval, sizeof( int ) );

    // Bind the socket to the IP address and port
    int error = bind( masterSocket,
                      (struct sockaddr *)&serverIPAddress,
                      sizeof(serverIPAddress) );
    if ( error ) {
      perror("bind");
      exit( -1 );
    }

    error = listen( masterSocket, 5);
        if (error) {
                perror("listen");
                exit(-1);
        }
        struct sockaddr_in clientIPAddress;
        int alen = sizeof(clientIPAddress);
        int clientSocket = accept( masterSocket, (struct sockaddr *)&clientIPAddress, (socklen_t*)&alen);
        return clientSocket;
        //return conn;

}

void communicationLoop(int connection) {
        int n = 0;
        while (TRUE) {
                char recv[100];
                n = read(connection, recv, 100);
                if (n != 0 && !sent) {
                        sendHdr(connection, "test.html");
                        writeDocument(connection, "test.html");
                        sent = TRUE;
                }

                n = 0;
        }



}

int main(int argc, char **argv) {

        int client = serverConnect();
        communicationLoop(client);
}



//Code from CS252 lab5:

void writeDocument(int client, char *documentName) {
         int fd = open(documentName, O_RDONLY|O_CREAT, 0444);
         //free(documentName);
         documentName = NULL;

         int sizTXT = 0;

         char *fileData = readFile(fd, &sizTXT);
         fprintf(stderr, "\ndata: %s\n", fileData);
         write(client, fileData, sizTXT + 1);    //Might need 1 extra Nul    l byte

         free(fileData); //free the allocated file data

         close(fd);
 }




//return file's text as character pointer
 //update size to match size of file to write as a whole
 char * readFile(int fd, int *textSize) {
         char newChar;
         //May be slow 1 character at a time
         //count length
         fprintf(stderr, "\nRead File\n");
         while(read(fd, &newChar, 1) != 0) {
                 *textSize = *textSize + 1;
                 if(*textSize % 200000 == 0)     fprintf(stderr, "num: %d     ", *textSize);
         }

         // get data
         char *fileData = (char *)malloc(sizeof(char) * (*textSize + 1));
         lseek(fd, 0, SEEK_SET);

         read(fd, fileData, *textSize);
         fileData[*textSize] = '\0';
         fprintf(stderr, "File retrun");
         return fileData;
 }

 void sendHdr(int client, char * docName) {
         // What to write
         //char * type = getDocType(docName);
         char *type = "text/html";
         const char * hdr1 = "HTTP/1.1 200 Document follows\r\n";
         const char * hdr2 = "Server: CS 252 lab5\r\n";
         const char * hdr3p1 = "Content-type: ";
         const char * hdr3p2 = "\r\n";

         //fprintf(stderr, "\n\nType: %s\n\n", type);
         //Writing
         write(client, hdr1, strlen(hdr1));
         write(client, hdr2, strlen(hdr2));
         write(client, hdr3p1, strlen(hdr3p1));
         write(client, type, strlen(type));//Content Type
         write(client, hdr3p2, strlen(hdr3p2));
         write(client, "\r\n", 2); //"Final"
 }