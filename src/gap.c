/*************************************************************************
**
**    gap.c                         NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Rev$
*/

#include "nq.h"

word	Epimorphism();
int	NumberOfAbstractGens();

void	printGapWord( word w )
{
   int nrc = 30;      /* something has already been printed */

   if ( w == (word)0 || w->g == EOW ) {
      printf( "One(F)" );
      return;
   }
	
   while ( w->g != EOW ) {
      if ( w->g > 0 ) {
         nrc += printf( "NqF.%d", w->g );
         if ( w->e != (exp)1 )
#ifdef LONGLONG
            nrc += printf( "^%Ld", w->e );
#else
            nrc += printf( "^%d", w->e );
#endif
      }
      else {
         nrc += printf( "NqF.%d", -w->g );
#ifdef LONGLONG
         nrc += printf( "^%Ld", -w->e );
#else
         nrc += printf( "^%d", -w->e );
#endif
      }
      w++;
      if ( w->g != EOW ) { 
         putchar( '*' ); 
         nrc++;

         /*
         **  Insert a line break, because GAP can't take lines that
         **  are too long.
         */
         if ( nrc > 70 ) { 
            printf( "\\\n  " ); 
            nrc = 0; 
         }
      }
   }
}


void	PrintGapPcPres() 
{
   long i, j;

   /*
   **  Commands that create the appropriate free group and the
   **  collector. 
   */
   printf( "NqF := FreeGroup( %d );\n", NrPcGens+NrCenGens );
   printf( "NqCollector := FromTheLeftCollector( NqF );\n" );
   for ( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
      if ( Exponent[i] != (exp)0 ) {
         printf( "SetRelativeOrder( NqCollector, %ld, ", i );
#ifdef LONGLONG
         printf( "%Ld", Exponent[i] );
#else
         printf( "%d", Exponent[i] );
#endif
         printf( " );\n" );
      }
   }

   /*
   **  Print the power relations.
   */
   for ( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
      if ( Exponent[i] != (exp)0 && 
         Power[i] != (word)0 && Power[i]->g != EOW ) {
         printf( "SetPower( NqCollector, %ld, ", i );
         printGapWord( Power[i] );
         printf( " );\n" );
      }
   }

   /*
   **  Print the conjugate relations.
   */
   for ( j = 1; j <= NrPcGens; j++ ) {
      i = 1;
      while( i < j && Wt(i) + Wt(j) <= Class + (NrCenGens==0?0:1) ) {
         /* print Conjugate[j][i] */
         printf( "SetConjugate( NqCollector, %ld, %ld, ", j, i );
         printGapWord( Conjugate[j][i] );
         printf( " );\n" );
         if ( 1 && Exponent[i] == (exp)0 ) {
            printf( "SetConjugate( NqCollector, %ld, %ld, ", j, -i );
            printGapWord( Conjugate[j][-i] );
            printf( " );\n" );
         }
         if ( 1 && Exponent[j] == (exp)0 ) {
            printf( "SetConjugate( NqCollector, %ld, %ld, ", -j, i );
            printGapWord( Conjugate[-j][i] );
            printf( " );\n" );
         }
         if ( 1 && Exponent[i] + Exponent[j] == (exp)0 ) {
            printf( "SetConjugate( NqCollector, %ld, %ld, ", -j, -i );
            printGapWord( Conjugate[-j][-i] );
            printf( " );\n" );
         }
         i++;
      }
   }

   /*
   **  Print the epimorphism.  It is sufficient to list the images.
   */
   printf( "NqImages := [\n" );
   for( i = 1; i <= NumberOfAbstractGens(); i++ ) {
      printGapWord( Epimorphism( i ) );
      printf( ",\n" );
   }
   printf( "];\n" );

   printf( "NqClass := %d;\n", Class );
   printf( "NqRanks := [ " );
   for ( i = 1; i <= Class; i++ ) printf( " %d,", Dimension[i] );
      printf( "];\n" );
}

void	printRawWord( word w )
{
   int nrc = 15;      /* something has already been printed */

   if ( w == (word)0 || w->g == EOW )
      return;
	
   while ( w->g != EOW ) {
      if ( w->g > 0 ) {
         nrc += printf( " %d,", w->g );
#ifdef LONGLONG
         nrc += printf( " %Ld,", w->e );
#else
         nrc += printf( " %d,", w->e );
#endif
      }
      else {
         nrc += printf( " %d,", -w->g );
#ifdef LONGLONG
         nrc += printf( " %Ld,", -w->e );
#else
         nrc += printf( " %d,", -w->e );
#endif
      }
      w++;
      /* Avoid long lines, because GAP can't read them. */
      if ( w->g != EOW && nrc > 70 ) { 
         printf( "\\\n    " );
         nrc = 0; 
      }
   }
}

void	PrintRawGapPcPres()
{
   long i, j;
   long cl = Class + (NrCenGens==0 ? 0 : 1);


   /*
   **  Output the number of generators first and their relative
   **  orders.  
   */
   printf( "NqNrGenerators   :=  %d;\n", NrPcGens+NrCenGens );
   printf( "NqRelativeOrders := [ " );
   for ( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
#ifdef LONGLONG
      printf( "%Ld,", Exponent[i] );
#else
      printf( "%d,", Exponent[i] );
#endif
      if ( i % 30 == 0 ) 
         printf( "\n                       " );    
   }
   printf( " ];\n" );

   /*
   **  Print weight information.
   */
   printf( "NqClass          := %d;\n", Class );
   printf( "NqRanks          := [" );
   for ( i = 1; i <= cl; i++ ) 
      printf( " %d,", Dimension[i] );
   printf( "];\n" );

   /*
   **  Print the epimorphism.  It is sufficient to list the images.
   */
   printf( "NqImages         := [\n" );
   for ( i = 1; i <= NumberOfAbstractGens(); i++ ) {
      printf( "  [ " );
      printRawWord( Epimorphism( i ) );
      printf( "],  # image of generator %ld\n", i );
   }
   printf( "];\n" );

   /*
   **  Print the power relations.
   */
   printf( "NqPowers         := [\n" );
   for ( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
      if ( Exponent[i] != (exp)0 && 
           Power[i] != (word)0 && 
           Power[i]->g != EOW 
         ) {
         printf( "  [ %ld,   ", i );
         printRawWord( Power[i] );
         printf( " ],\n" );
      }
   }
   printf( "];\n" );

   /*
   **  Print the conjugate relations.
   */
   printf( "NqConjugates     := [\n" );
   for ( j = 1; j <= NrPcGens; j++ ) {
      for ( i = 1; i < j && Wt(i) + Wt(j) <= cl; i++ ) {
         printf( "  [ %ld, %ld,   ", j, i );
         printRawWord( Conjugate[j][i] );
         printf( "],\n" );
      }
   }

   for ( j = 1; j <= NrPcGens; j++ ) {
      for ( i = 1; i < j && Wt(i) + Wt(j) <= cl; i++ ) {
         if ( Exponent[i] == (exp)0 ) {
            printf( "  [ %ld, %ld,   ", j, -i );
            printRawWord( Conjugate[j][-i] );
            printf( "],\n" );
         }
      }
   }

   for ( j = 1; j <= NrPcGens; j++ ) {
      for ( i = 1; i < j && Wt(i) + Wt(j) <= cl; i++ ) {
         if ( Exponent[j] == (exp)0 ) {
            printf( "  [ %ld, %ld,   ", -j, i );
            printRawWord( Conjugate[-j][i] );
            printf( "],\n" );
         }
      }
   }

   for ( j = 1; j <= NrPcGens; j++ ) {
      for ( i = 1; i < j && Wt(i) + Wt(j) <= cl; i++ ) {
         if ( Exponent[i] + Exponent[j] == (exp)0 ) {
            printf( "  [ %ld, %ld,   ", -j, -i );
            printRawWord( Conjugate[-j][-i] );
            printf( "],\n" );
         }
      }
   }
   printf( "];\n" );

   printf( "NqRuntime := %ld;\n", RunTime() );
}


/************************************************************************
** $Log: gap.c,v $
** Revision 1.9  2008-11-12 18:38:05  bg41
** Style changes -bkg
**
** Revision 1.8  2008-09-30 17:44:59  bg41
** I discovered that %ld does long ints, so I took the casts out 
** & switched %d to %ld -bkg
**
** Revision 1.7  2008-09-30 17:24:34  bg41
** cast a lot of long ints to ints for printf -bkg
**
** Revision 1.6  2008-09-30 16:45:33  bg41
** removed a couple unused variables -bkg
**
** Revision 1.5  2008-09-26 14:59:23  bg41
** added prototypes for Epimorphism() & NumberOfAbstractGens() 
** to fix compiler warnings -bkg
**
** Revision 1.4  2008-09-25 19:54:53  bg41
** modified header & added footer -bkg
*/
