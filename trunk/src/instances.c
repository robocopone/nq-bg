/*************************************************************************
**
**    instances.c                   NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Rev$
*/


#include "presentation.h"
#include "nq.h"

int	EvalSingleRelation( node * r );


word * Instances;

/************************************************************************
**  The parameters of EnumerateWords() have the following meaning:
**
**  <r>          a relation involving <l> identical generators.
**  <l>          the number of identical generators.
**  <instances>  the list of instances to be built up corresponding the
**               identical generators. 
**  <n>          the index of the current word in <instances>
**  <i>          the first free index in the current word
**  <g>          the next generator in the current word
**  <wt>         the weight that can spend on the next generators.
*/

static
void	EnumerateWords( node * r, long l, word * instances, 
                        long n, long i, gen g, long wt )
{
   long save_wt;
   word u = instances[ n ];
 
   if ( wt == 0 ) {
      gen h;
      if ( EvalSingleRelation( r ) ) {
         printf( "#  essential: " ); 
         for( h = 1; h <= NrIdenticalGensNode; h++ ) {
            printWord( Instances[ h ], 'a' ); 
            printf( ", " );
         }
         printf( "\n" );
      }
      return;
   }
    
   if ( g > NrPcGens+NrCenGens ) 
      return;
   save_wt = wt;
   while ( !EarlyStop && 
           g <= NrPcGens+NrCenGens && 
           Wt(g) <= wt-(l-n) ) {
      u[i].g   = g;
      u[i].e   = (exp)0;
      u[i+1].g = EOW;
      while( !EarlyStop && Wt(g) <= wt-(l-n) ) {
         u[i].e++;
         wt -= Wt(g);
         if ( Exponent[g] > (exp)0 && Exponent[g] == u[i].e ) 
            break;
         EnumerateWords( r, l, instances, n, i+1, g+1, wt );
         if( n < NrIdenticalGensNode )
            EnumerateWords( r, l, instances, n+1, 0, 1, wt );
      }
      wt = save_wt;
      g++;
   }
   u[i].g = EOW;
   u[i].e = (exp)0;
}

void    EvalIdenticalRelation( node * r )
{
   gen g;
   long c;

   if ( Instances == (word *)0 )
      Instances = (word *)
                  Allocate( (NumberOfIdenticalGens()+1) * sizeof(word) );

   for ( g = 1; g <= NumberOfIdenticalGens(); g++ ) {
      if ( Instances[ g ] != (word)0 ) 
         Free( Instances[ g ] );
         Instances[ g ] = (word)
                     Allocate( (NrPcGens+NrCenGens+1) * sizeof(gpower) );
   }
    
   for ( c = NrIdenticalGensNode; !EarlyStop && c <= Class+1; c++ )
      EnumerateWords( r, NrIdenticalGensNode, Instances, 1, 0, 1, c );
}

/************************************************************************
** $Log: instances.c,v $
** Revision 1.4  2008-11-18 16:16:33  bg41
** Style changes -bkg
**
** Revision 1.3  2008-11-18 16:15:34  bg41
** Style changes -bkg
**
** Revision 1.2  2008-09-26 15:53:02  bg41
** updated header, added footer
** added prototype for EvalSingleRelation() -bkg
*/
