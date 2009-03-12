/*************************************************************************
**
**    eliminate.c                   NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Rev$
*/


#include <stdlib.h>
#include "nq.h"


int	ElimAllEpim( int n, expvec * M, gen * renumber  );
void	freeExpVecs( expvec * M );

long	appendExpVector( gen k, expvec ev, word w, gen * renumber )
{
   long l = 0;

   /* Copy the negative of the exponent vector ev[] into w. */
   for( ; k <= NrCenGens; k++ ) {
      if( ev[k] > (exp)0 ) {
         if( Exponent[renumber[k]] != (exp)0 )
            printf( "Warning: Positive entry in matrix." );
         else {
            w[l].g = -renumber[k];
            w[l].e = ev[k];
         }
      }
      else if( ev[k] < (exp)0 ) {
         w[l].g = renumber[k];
         w[l].e = -ev[k];
      }
      else
         continue;
      if( Exponent[abs(w[l].g)] != (exp)0 ) {
         if( w[l].g < 0 )
            printf( "Negative exponent for torsion generator.\n" );
         if( w[l].e >= Exponent[w[l].g] )
            printf( "Unreduced exponent for torsion generators.\n" );
      }
      l++;
   }
   w[l].g = EOW;
   w[l].e = (exp)0;
   l++;
   return l;
}

word	elimRHS( word v, long * eRow, gen * renumber, 
                 expvec ev, expvec * M )
{
   word w;
   gen cg;
   long j, k, l;
   exp s;

   w = (word)malloc( (NrPcGens+NrCenGens+1)*sizeof(gpower) );
   if ( w == (word)0 ) {
      perror( "elimRHS(), w" );
      exit( 2 );
   }

   /* copy the first NrPcGens generators into w. */
   l = 0;
   while ( v->g != EOW && abs(v->g) <= NrPcGens ) { 
      w[l] = *v++; 
      l++; 
   }

   /* copy the eliminating rows into ev[]. */
   while( v->g != EOW ) {
      cg = abs(v->g) - NrPcGens;
      if ( cg <= 0 )
         printf( "Warning : non-central generator in elimRHS()\n" );
      if ( eRow[ cg ] == -1 || M[eRow[cg]][cg] != (exp)1 )
         /* generator cg survives. */
         ev[ cg ] += sgn(v->g) * v->e;
      else
         for( k = cg+1; k <= NrCenGens; k++ )
	    ev[k] -= sgn(v->g) * v->e * M[eRow[cg]][k];
      v++;
   }

   /* Reduce all entries modulo the exponents. */
   for ( k = 1; k <= NrCenGens; k++ ) {
      if ( renumber[k] > 0 && Exponent[renumber[k]] > (exp)0 ) {
         if ( (s = ev[k] / Exponent[renumber[k]]) != (exp)0 || 
              ev[k] < (exp)0 
            ) {
            if ( ev[k] - s * M[eRow[k]][k] < (exp)0 )
               s--;
            for ( j = k; j <= NrCenGens; j++ )
               ev[j] -= s * M[eRow[k]][j];
         }
      }
   }

   /* Now copy the exponent vector back into the word. */
   for ( k = 1; k <= NrCenGens; k++ ) {
      if ( ev[k] > (exp)0 ) {
         w[l].g = renumber[k];
         w[l].e = ev[k];
      }
      else if ( ev[k] < (exp)0 ) {
         w[l].g = -renumber[k];
         w[l].e = -ev[k];
      }
      else 
         continue;
      if ( Exponent[abs(w[l].g)] != (exp)0 ) {
         if ( w[l].g < 0 )
            printf( "Negative exponent for torsion generator.\n" );
         if ( w[l].e >= Exponent[w[l].g] )
            printf( "Unreduced exponent for torsion generators.\n" );
      }
      l++;
   }
   w[l].g = EOW;
   w[l].e = (exp)0;
   l++;

   for( k = 1; k <= NrCenGens; k++ ) 
      ev[k] = (exp)0;
   return (word)realloc( w, l*sizeof(gpower) );
}

void	ElimGenerators()
{
   long i, j, k, l, n = 0, *eRow, t = 0;
   expvec ev, *M = 0;
   gen *renumber;
   word v, w;

   extern expvec * MatrixToExpVecs();

   if( Verbose ) 
      t = RunTime();

   M = MatrixToExpVecs();

   /*
   ** first assign a new number to each central generator which is
   ** not to be eliminated. 
   */

   renumber = (gen*) calloc( NrCenGens+1, sizeof(gen) );
   if ( renumber == (gen*)0 ) {
      perror( "elimGenerators(), renumber" );
      exit( 2 );
   }
   for ( k = 1, i = 0; k <= NrCenGens; k++ ) {
      if ( i >= NrRows || k != Heads[i] )
         renumber[ k ] = NrPcGens + k - n;
      /* k will become a torsion element */
      else if ( M[i][k] != 1 ) {
         renumber[ k ] = NrPcGens + k - n;
         Exponent[ renumber[k] ] = M[i][k];
         i++;
      }
      /* k will be eliminated */
      else {
         n++;
         i++;
      }
   }

   /*
   ** extend the memory for Power[], note that n is the number of
   ** generators to be eliminated.
   */

   Power = (word*)realloc( Power,(NrPcGens+NrCenGens+1-n)*sizeof(word) );
   if ( Power == (word*)0 ) {
      perror( "elimGenerators(), Power" );
      exit( 2 );
   }

   /* extend the memory for Definition[]. */
   Definition = (def*)realloc( Definition, 
                               ( NrPcGens+NrCenGens+1-n)*sizeof(def) );
   if( Definition == (def*)0 ) {
      perror( "elimGenerators(), Definition" );
      exit( 2 );
   }

   /*
   ** first we eliminate ALL central generators that occur in the
   ** epimorphism.
   */

   i = ElimAllEpim( n, M, renumber );

   /*
   ** secondly we eliminate ALL generators from right hand sides of
   ** power relations.
   */

   for ( j = 1; j <= NrPcGens; j++ ) {
      if ( Exponent[j] != (exp)0 ) {
         l = WordLength( Power[ j ] );
         w = (word)malloc( (l+NrCenGens+1-n)*sizeof(gpower) );
         WordCopy( Power[ j ], w );
         l--;
         l += appendExpVector( w[l].g+1-NrPcGens, M[i], w+l, renumber );

         if ( Power[j] != (word)0 ) 
            free( Power[j] );
         if ( l == 1 ) {
            Power[j] = (word)0;
            free( w );
         }
         else
            Power[j] = (word)realloc( w, l*sizeof(gpower) );
         i++;
      }
   }

   /*
   ** Thirdly we eliminate the generators from the right hand
   ** side of conjugates, but before that we fix the definitions
   ** of surviving generators.
   */

   /*
   ** set up an array that specifies the row which eliminates a
   ** generator.
   */

   eRow = (long*)malloc( (NrCenGens+1)*sizeof(long) );
   if ( eRow == (long*)0 ) {
      perror( "elimGenerators(), eRow" );
      exit( 2 );
   }
   for ( k = 0; k <= NrCenGens; k++ ) 
      eRow[ k ] = -1;
   for ( k = 0; k <  NrRows;    k++ ) 
      eRow[ Heads[k] ] = k;

	
   ev = (expvec)calloc( (NrCenGens+1), sizeof(exp) );
   if ( ev == (expvec)0 ) {
      perror( "elimGenerators(), ev" );
      exit( 2 );
   }

   for ( j = 1; j <= NrPcGens; j++ ) {
      for ( i = 1; i < j; i++ ) {
         if ( Wt(j) + Wt(i) > Class+1 ) 
            continue;

         k = Conjugate[j][i][1].g - NrPcGens;
         if ( k > 0 && i <= Dimension[1] && 
             j > NrPcGens-Dimension[Class] &&
             (eRow[ k ] == -1 || M[eRow[k]][k] != (exp)1) 
            ) {
            /*
            ** Fix the definitions of surviving generators and
            ** their power relations.
            */
            Conjugate[j][i][1].g = renumber[k];
            Definition[ renumber[k] ].h  = j;
            Definition[ renumber[k] ].g  = i;
            if( eRow[ k ] != -1 ) {
               w = (word)malloc( (NrCenGens+1-n)*sizeof(gpower) );
               if( w == (word)0 ) {
                  perror( "elimGenerators(), w" );
                  exit( 2 );
               }
               l = appendExpVector( k+1, M[eRow[k]], w, renumber );
               w = (word)realloc( w, l*sizeof(gpower) );
               Power[ renumber[k] ] = w;
            }
         }
         else {
            v = elimRHS( Conjugate[j][i], eRow, renumber, ev, M );
            if( Conjugate[j][i] != Generators[j] )
               free( Conjugate[j][i] );
            Conjugate[j][i] = v;
         }

         if( Exponent[i] == (exp)0 ) {
            v = elimRHS( Conjugate[j][-i], eRow, renumber, ev, M );
            if( Conjugate[j][-i] != Generators[j] )
               free( Conjugate[j][-i] );
            Conjugate[j][-i] = v;
         }
         if( Exponent[j] == (exp)0 ) {
            v = elimRHS( Conjugate[-j][i], eRow, renumber, ev, M );
            if( Conjugate[-j][i] != Generators[-j] )
               free( Conjugate[-j][i] );
            Conjugate[-j][i] = v;
         }
         if( Exponent[j] + Exponent[i] == (exp)0 ) {
            v = elimRHS( Conjugate[-j][-i], eRow, renumber, ev, M );
            if( Conjugate[-j][-i] != Generators[-j] )
               free( Conjugate[-j][-i] );
            Conjugate[-j][-i] = v;
         }
      }
   }

   /* Now adjust the sizes of the arrays */
   Commute = (gen*)realloc( Commute, 
                            (NrPcGens+NrCenGens+1-n)*sizeof(gen) );
   Exponent = (exp*)realloc( Exponent, 
                             (NrPcGens+NrCenGens+1-n)*sizeof(exp) );

   free( renumber );
   free( ev );
   free( eRow );

   if( M != (expvec*)0 ) 
      freeExpVecs( M );
   NrCenGens -= n;

   if( Verbose )
      printf("#    Eliminated generators (%ld msec).\n",RunTime()-t);
}


/*************************************************************************
** $Log: eliminate.c,v $
** Revision 1.8  2008-11-12 17:13:02  bg41
** style changes -bkg
**
** Revision 1.7  2008-11-04 20:13:42  bg41
** Style changes -bkg
**
** Revision 1.6  2008-09-30 18:02:09  bg41
** added an initilizer to a variable & switched a %d to a %ld -bkg
**
** Revision 1.5  2008-09-26 17:05:49  bg41
** added prototype for ElimAllEpim()
** added prototype for freeExpVecs() -bkg
**
** Revision 1.4  2008-09-25 19:20:20  bg41
** modified header -bkg
**
** Revision 1.3  2008-09-25 19:05:51  bg41
** #include <stdlib> added to fix incompatible 
** implicit declaration warning -bkg
**
** Revision 1.2  2008-09-25 19:05:09  bg41
** Modified header & footer -bkg
*/
