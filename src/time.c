/*****************************************************************************
**
**    time.c                         NQ-BG                   Bradley Graber
**                                                      bg41@evansville.edu
**
**    $Id: time.c,v 1.3 2008-09-25 19:22:13 bg41 Exp $
*/

#include <stdio.h>

int CombiCollectionTime  = 0;
int SimpleCollectionTime = 0;

int IntMatTime     = 0;

void PrintCollectionTimes() {

  if( CombiCollectionTime > 0 )
    printf( "##  Total time spent in combinatorial collection: %d\n",
            CombiCollectionTime );

  if( SimpleCollectionTime > 0 )
    printf( "##  Total time spent in simple collection: %d\n",
            SimpleCollectionTime );

  printf( "##  Total time spent on integer matrices: %d\n", IntMatTime );

}


/****************************************
** $Log: time.c,v $
** Revision 1.3  2008-09-25 19:22:13  bg41
** #include <stdio.h> added to fix a compiler warning -bkg
**
** Revision 1.2  2008-09-25 19:18:21  bg41
** Modified header & added footer -bkg
**
**
*/
