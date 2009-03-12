/*************************************************************************
**
**    addgen.c                      NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Id: addgen.c,v 1.9 2008-11-12 16:10:01 bg41 Exp $
*/

#include <stdlib.h>
#include "nq.h"

int	NumberOfAbstractGens();
int	ExtendEpim();
void	printGen( gen g, char c );

/*************************************************************************
**  Set up a list of Commute[] arrays.  The array in CommuteList[c] is
**  Commute[] as if the current group had class c.  CommuteList[Class+1][]
**  is the same as Commute[].
**
**  did commute with all generators of weight Class-c. From here
**  on it will only commute with generators of weight Class-c+1
**  since new generators of weight Class+1 have been introduced.
**
**  Old code to set the commute array.

	Commute = (gen*)realloc( Commute, (G+1)*sizeof(gen) );
	if( Commute == (gen*)0 ) {
	    perror( "addGenerators(), Commute" );
	    exit( 2 );
	}
	l = 1;
	G = NrPcGens;
	for( c = 1; 2*c <= Class+1; c++ ) {
	    for( i = 1; i <= Dimension[c]; i++, l++ )
		Commute[l] = G;
	    G -= Dimension[ Class-c+1 ];
	}
	for( ; l <= NrPcGens+NrCenGens; l++ ) Commute[l] = l;
*/

void	SetupCommuteList() 
{
   int c;
   gen g, h;
    
   if( CommuteList != (gen**)0 ) {
      for( c = 1; c <= Class; c++ ) Free( CommuteList[c] );
      Free( CommuteList );
   }
            
   CommuteList = (gen**)Allocate( (Class+2)*sizeof(gen*) );
   for( c = 1; c <= Class+1; c++ ) {
      CommuteList[ c ] = (gen*)Allocate( (NrPcGens + NrCenGens + 1) * 
                                         sizeof(gen) );
      for( g = 1; g <= NrPcGens; g++ ) {
         for( h = g+1; Wt(g)+Wt(h) <= c; h++ ) ;
         CommuteList[c][g] = h-1;
      }
      for( ; g <= NrPcGens+NrCenGens; g++ ) 
         CommuteList[c][g] = g;
   }
}

void	SetupCommute2List()
{
   int c;
   gen g, h;
    
   if( Commute2List != (gen**)0 ) {
      for( c = 1; c <= Class; c++ ) Free( Commute2List[c] );
      Free( Commute2List );
   }
            
   Commute2List = (gen**)Allocate( (Class+2)*sizeof(gen*) );
   for( c = 1; c <= Class+1; c++ ) {
      Commute2List[ c ] = (gen*)Allocate( (NrPcGens + NrCenGens + 1) * 
                                          sizeof(gen) );
              
      for( g = 1; g <= NrPcGens && 3*Wt(g) <= c; g++ ) {
         for( h = CommuteList[c][g]; h > g && 2*Wt(h)+Wt(g) > c; h-- );
         Commute2List[c][g] = h;
      }
      for( ; g <= NrPcGens+NrCenGens; g++ )
         Commute2List[c][g] = g;
   }
}

void	SetupNrPcGensList() 
{
   int c;
    
   if( NrPcGensList != (int *)0 )
      Free( NrPcGensList );
            
   NrPcGensList = (int *)Allocate( (Class+2)*sizeof(int) );

   if( Class == 0 ) {
      NrPcGensList[ Class+1 ] = NrCenGens;
      return;
   }

   NrPcGensList[1] = Dimension[1];
   for( c = 2; c <= Class; c++ )
      NrPcGensList[ c ] = NrPcGensList[c-1] + Dimension[c];

   NrPcGensList[ Class+1 ] = NrPcGensList[ Class ] + NrCenGens;

   printf( "##  Sizes:" );
   for( c = 1; c <= Class+1; c++ )
      printf( "  %d", NrPcGensList[c] );
   printf( "\n" );
}


/*************************************************************************
**  Add new/pseudo generators to the power conjugate presentation.    
*/

void	AddGenerators()
{
   long	t = 0;
   gen	i, j;
   int	l, G;
   word	w;
	
   if( Verbose ) 
      t = RunTime();

   G = NrPcGens;

   /**********************************************************************
   ** Extend the definitions array by a safe amount.  We could compute
   ** the exact number of new generators to be introduced, but is it
   ** worth the effort?                                                 
   */ 

   Definition = (def*)realloc( Definition, 
                               (G + (Dimension[1]+1) * 
                               NrPcGens + 1 +
                               NumberOfAbstractGens()) * sizeof(def) );
   
   if( Definition == (def*)0 ) {
      perror( "AddGenerators(), Definition" );
      exit( 2 );
   }

   G += ExtendEpim();

   /* Firstly mark all definitions in the pc-presentation. */
   for( j = Dimension[1]+1; j <= NrPcGens; j++ )
      Conjugate[ Definition[j].h ][ Definition[j].g ] =
         (word)((unsigned long)
         (Conjugate[Definition[j].h][Definition[j].g]) | 0x1);

   /* Secondly new generators are defined. */
   for( j = 1; j <= NrPcGens; j++ ) {
      if( Exponent[j] != (exp)0 ) {
         G++;
         l = 0;
         if( Power[j] != (word)0 ) 
            l = WordLength( Power[ j ] );
         w = (word)malloc( (l+2)*sizeof(gpower) );
         if( Power[j] != (word)0 ) 
            WordCopy( Power[ j ], w );
         w[l].g = G;
         w[l].e = (exp)1;
         w[l+1].g = EOW; 
         w[l+1].e = (exp)0;
         if( Power[ j ] != (word)0 ) 
            free( Power[ j ] );
         Power[ j ] = w;
         Definition[ G ].h = j;
         Definition[ G ].g = (gen)0;
         if( Verbose ) {
            printf( "#    generator %d = ", G );
            printGen( j, 'A' );
#ifdef LONGLONG
            printf( "^%Ld\n", Exponent[j] );
#else
            printf( "^%d\n", Exponent[j] );
#endif
         }
      }
   }

   /**********************************************************************
   **  Conjugates
   **
   **  New/pseudo generators are only defined for commutators of the
   **  form [x,1], the rest is computed in Tails().
   */
   for( j = 1; j <= NrPcGens; j++ ) {
      for( i = 1; i <= min(j-1,Dimension[1]); i++ ) {
         if( !((unsigned long)(Conjugate[j][i]) & 0x1) ) {
            G++;
            l = WordLength( Conjugate[ j ][ i ] );
            w = (word)malloc( (l+2)*sizeof(gpower) );
            WordCopy( Conjugate[j][i], w );
            w[l].g = G;
            w[l].e = (exp)1;
            w[l+1].g = EOW;
            w[l+1].e = (exp)0;
            if( Conjugate[j][i] != Generators[j] )
               free( Conjugate[j][i] );
            Conjugate[j][i] = w;
            Definition[ G ].h = j;
            Definition[ G ].g = i;
            if( Verbose ) {
               printf( "#    generator %d = [", G );
               printGen( j, 'A' );
               printf( ", " );
               printGen( i, 'A' );
               printf( "]\n" );
            }
         }
      }
   }

   if( G == NrPcGens ) {
      printf( "##  Warning : no new generators in addGenerators()\n" );
      return;
   }

   /* Thirdly remove the marks from the definitions. */
   for( j = Dimension[1]+1; j <= NrPcGens; j++ )
      Conjugate[Definition[j].h][Definition[j].g] =
                    (word)((unsigned long)
                    (Conjugate[Definition[j].h][Definition[j].g]) & ~0x1);

   /* Fourthly enlarge the necessary arrays, so the collector works. */

   Definition = (def*)realloc( Definition, (G+1)*sizeof(def) );

   Exponent = (exp *)realloc( Exponent, (G+1)*sizeof(exp) );
   if( Exponent == (exp *)0 ) {
      perror( "addGenerators(), Exponent" );
      exit( 2 );
   }

   for( i = NrPcGens+1; i <= G; i++ ) 
      Exponent[i] = (exp)0;

   Power = (word *)realloc( Power, (G+1)*sizeof(word) );
   if( Power == (word *)0 ) {
      perror( "addGenerators(), Power" );
      exit( 2 );
   }
   for( i = NrPcGens+1; i <= G; i++ )
      Power[i] = (word)0;

   Weight = (int *)realloc( Weight, (G+1)*sizeof(long) );
   if( Weight == (int *)0 ) {
      perror( "addGenerators(), Weight" );
      exit( 2 );
   }
   for( i = NrPcGens+1; i <= G; i++ ) 
      Weight[i] = Class+1;

   NrCenGens = G - NrPcGens;


   SetupCommuteList();
   SetupCommute2List();
   SetupNrPcGensList();

   Commute  = CommuteList[ Class+1 ];
   Commute2 = Commute2List[ Class+1 ];

   if( Verbose )
     printf("#    Added new/pseudo generators (%ld msec).\n",RunTime()-t);
}

/*************************************************************************
** $Log: addgen.c,v $
** Revision 1.9  2008-11-12 16:10:01  bg41
** More style changes -bkg
**
** Revision 1.8  2008-11-04 16:54:46  bg41
** Style changes -bkg
**
** Revision 1.7  2008-09-30 18:11:49  bg41
** initialized a variable
** removed some unused variables
** switched a %d to %ld -bkg
**
** Revision 1.6  2008-09-26 17:15:12  bg41
** added prototypes for NumberOfAbstractGens(), ExtendEpim(), & printGen();
** added return type of void for SetupNrPcGensList() -bkg
**
** Revision 1.5  2008-09-25 19:19:01  bg41
** modified header -bkg
**
** Revision 1.4  2008-09-25 19:16:43  bg41
** #include <stdlib> added to fix incompatible implicit declaration 
** warning -bkg
**
** Revision 1.3  2008-09-25 19:15:52  bg41
** Modified header & added footer -bkg
*/
