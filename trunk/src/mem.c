/*************************************************************************
**
**    mem.c                         NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Rev$
*/

#include <stdio.h>
#include <stdlib.h>
#include "mem.h"

void	AllocError( char * str )
{
   fflush( stdout );

   fprintf( stderr, "%s failed: ", str );
   perror( "" );
   exit( 4 );
}
    
void *	Allocate( unsigned nchars )
{
   void * ptr;

   ptr = (void *)calloc( nchars, sizeof(char) );
   if ( ptr == (void *) 0 )
      AllocError( "Allocate" );

   if ( (unsigned long)ptr & 0x3 )
      printf( "Warning, pointer not aligned.\n" );
   return ptr;
}

void *	ReAllocate( void * optr, unsigned nchars )
{
   optr = (void *)realloc( (char *)optr, nchars );
   if ( optr == (void *)0 )
      AllocError( "ReAllocate" );

   if ( (unsigned long)optr & 0x3 )
      printf( "Warning, pointer not aligned.\n" );
   return optr;
}

void	Free( void * ptr )
{
   free( (char *)ptr );
}

/*************************************************************************
** $Log: mem.c,v $
** Revision 1.5  2008-11-18 16:20:39  bg41
** Style changes -bkg
**
** Revision 1.4  2008-09-25 19:19:32  bg41
** modified header -bkg
**
** Revision 1.3  2008-09-25 19:14:04  bg41
** #include <stdlib> added to fix incompatible implicit 
** declaration warning -bkg
**
** Revision 1.2  2008-09-25 19:13:12  bg41
** modified header & added footer -bkg
*/
