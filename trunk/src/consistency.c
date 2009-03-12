/*************************************************************************
**
**    consistency.c                 NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Rev$
*/


#include "nq.h"

int	addRow( expvec ev );

void	printEv( expvec ev )
{
   long i;

   for( i = 1; i <= NrPcGens+NrCenGens; i++ )
#ifdef LONGLONG
      printf( " %Ld ", ev[i] );
#else
      printf( "%2ld ", (long)(ev[i]) );
#endif
}

void do_cba( gen c, gen b, gen a )
{
   int i;
   expvec ev1, ev2;

   if( Wt(c)+Wt(b)+Wt(abs(a)) > Class+1 ) 
      return;

   /* the left hand side first : c (b a) = c a b^a */
   ev1 = ExpVecWord( Generators[c] );
   Collect( ev1, Generators[a], (exp)1 );
   Collect( ev1, Conjugate[b][a], (exp)1 );

   /* then the right hand side : (c b) a */
   ev2 = ExpVecWord( Generators[c] );
   Collect( ev2, Generators[b], (exp)1 );
   Collect( ev2, Generators[a], (exp)1 );

   for( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
      ev1[i] -= ev2[i];
      if( ((ev1[i] << 1) >> 1) != ev1[i] )
         printf( "#    Possible overflow in do_cba( %d, %d, %d )\n", 
                 c, b, a );
   }
          
   free( ev2 );

   if( Debug ) {
      printf( "cba( %2d %2d %2d ) : ",c,b,a);
      printEv( ev1 );
      printf("\n");
   }
   addRow( ev1 );
}

void do_cbb( gen c, gen b )
{
   expvec ev;

   if( Wt(c)+Wt(b) > Class+1 ) 
      return;

   /* (c b) b^-1 */
   ev = ExpVecWord( Generators[c] );
   Collect( ev, Generators[ b], (exp)1 );
   Collect( ev, Generators[-b], (exp)1 );
   ev[ c ] -= 1;

   if( Debug ) {
      printf( "cbb( %2d %2d    ) : ", c, b );
      printEv( ev );
      printf("\n");
   }
   addRow( ev );

   if( EarlyStop ) 
      return;

   /* (c b^-1) b */
   ev = ExpVecWord( Generators[c] );
   Collect( ev, Generators[-b], (exp)1 );
   Collect( ev, Generators[ b], (exp)1 );
   ev[ c ] -= 1;

   if( Debug ) {
      printf( "cbb( %2d %2d    ) : ", c, -b );
      printEv( ev );
      printf("\n");
   }
   addRow( ev );
}

void do_ccb( gen c, gen b )
{
   expvec ev;

   if( Wt(c)+Wt(abs(b)) > Class+1 ) 
      return;

   /* c^-1 (c b) = c^-1 b c^b */
   ev = ExpVecWord( Generators[-c] );
   Collect( ev, Generators[b], (exp)1 );
   Collect( ev, Conjugate[c][b], (exp)1 );
   ev[abs(b)] -= sgn(b);

   if( Debug ) {
      printf( "ccb( %2d %2d    ) : ", c, b );
      printEv( ev );
      printf("\n");
   }
   addRow( ev );
}

void do_cbn( gen c, gen b )
{
   int i;
   expvec ev1, ev2;

   if( Wt(c)+Wt(b) > Class+1 ) 
      return;

   /* c (b^n) */
   ev1 = ExpVecWord( Generators[c] );
   Collect( ev1, Power[b], (exp)1 );

   /* (c b) b^(n-1) */
   ev2 = ExpVecWord( Generators[c] );
   Collect( ev2, Generators[b], Exponent[b] );

   for( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
      ev1[i] -= ev2[i];
      if( ((ev1[i] << 1) >> 1) != ev1[i] )
         printf( "#    Possible overflow in do_cbn( %d, %d )\n", c, b );
   }

   free( ev2 );
   if( Debug ) {
      printf( "cbn( %2d %2d    ) : ", c, b );
      printEv( ev1 );
      printf("\n");
   }
   addRow( ev1 );
}

void do_cnb( gen c, gen b )
{
   int i;
   expvec ev1, ev2;

   if( Wt(c)+Wt(abs(b)) > Class+1 ) 
      return;

   /* (c^n) b */
   ev1 = ExpVecWord( Power[c] );
   Collect( ev1, Generators[b], (exp)1 );

   /* c^(n-1) (c b) = c^(n-1) b c^b */
   ev2 = ExpVecWord( Generators[c] );
   if( Exponent[c] > (exp)2 )
      Collect( ev2, Generators[c], Exponent[c]-(exp)2 );
   Collect( ev2, Generators[b], (exp)1 );
   Collect( ev2, Conjugate[c][b], (exp)1 );

   for( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
      ev1[i] -= ev2[i];
      if( ((ev1[i] << 1) >> 1) != ev1[i] )
         printf( "#    Possible overflow in do_cnb( %d, %d )\n", c, b );
   }

   free( ev2 );
   if( Debug ) {
      printf( "cnb( %2d %2d    ) : ", c, b );
      printEv( ev1 );
      printf("\n");
   }
   addRow( ev1 );
}

void do_cnc( gen c )
{
   int i;
   expvec ev1, ev2;

   if( 2*Wt(c) > Class+1 ) 
      return;

   /* c^n c */
   ev1 = ExpVecWord( Power[c] );
   Collect( ev1, Generators[c], (exp)1 );

   /* c c^n */
   ev2 = ExpVecWord( Generators[c] );
   Collect( ev2, Power[c], (exp)1 );

   for( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
      ev1[i] -= ev2[i];
      if( ((ev1[i] << 1) >> 1) != ev1[i] )
         printf( "#    Possible overflow in do_cnc( %d )\n", c );
   }

   free( ev2 );
   if( Debug ) {
      printf( "cnb( %2d       ) : ", c );
      printEv( ev1 );
      printf("\n");
   }
   addRow( ev1 );
}

void	Consistency() 
{
   long t = 0;
   gen a, b, c;

   if( Verbose ) 
      t = RunTime();

   /* 
   **  c * ( b * a ) = ( c * b ) * a  for all generators c > b > a. 
   */
   for( a = 1; !EarlyStop && a <= Dimension[1]; a++ )
      for( b = a+1; !EarlyStop && b <= NrPcGens; b++ )
         for( c = b+1; !EarlyStop && c <= NrPcGens; c++ )
	    do_cba( c, b, a );


   /*
   **  c * ( b  * b' ) = ( c * b  ) * b' and
   **  c * ( b' * b  ) = ( c * b' ) * b  for all c > b,
   **                                    Exponent[b] == 0
   */
   for( b = 1; !EarlyStop && b <= NrPcGens; b++ )
      if( Exponent[b] == (exp)0 )
         for( c = b+1; !EarlyStop && c <= NrPcGens; c++ )
            do_cbb( c, b );

   /*
   **  c * ( c' * b ) = ( c * c' ) * b  and
   **  c * ( c' * b ) = ( c * c' ) * b' for all generators c > b,
   **                                     Exponent[c] == 0.
   */
   for( c = 1; !EarlyStop && c <= NrPcGens; c++ ) {
      if( Exponent[c] == (exp)0 ) {
         for( b = 1; !EarlyStop && b <= min(c-1,Dimension[1]); b++ )
            do_ccb( c, b );
         for( b = 1; !EarlyStop && b < c; b++ )
            if( Exponent[b] == (exp)0 ) do_ccb( c, -b );
      }
   }

   /*
   **    c * b^n = ( c * b ) * b^(n-1) for all generators c > b,
   **                                  Exponent[b] == n > 0.
   */
   for( b = 1; !EarlyStop && b <= NrPcGens; b++ )
      if( Exponent[b] > (exp)0 )
         for( c = b+1; !EarlyStop && c <= NrPcGens; c++ )
            do_cbn( c, b );

   /*
   **    c^n * b = c^(n-1) * ( c * b ) for all generators c > b,
   **                                  Exponent[c] == n > 0.
   */
   for( c = 1; !EarlyStop && c <= NrPcGens; c++ ){
      if( Exponent[c] > (exp)0 ) {
         for( b = 1; !EarlyStop && b <= min(c-1,Dimension[1]); b++ )
            do_cnb( c, b );
         for( b = 1; !EarlyStop && b < c; b++ )
            if( Exponent[b] == (exp)0 ) do_cnb( c, -b );
      }
   }

   /*
   **    c^n * c = c * c^n for all generators c, Exponent[c] == n > 0.
   */
   for( c = 1; !EarlyStop && c <= NrPcGens; c++ )
      if( Exponent[c] > (exp)0 )
         do_cnc( c );

   if( Verbose )
      printf("#    Checked consistency (%ld msec).\n",RunTime()-t);
}

/************************************************************************
** $Log: consistency.c,v $
** Revision 1.5  2008-11-12 16:58:12  bg41
** Style Changes -bkg
**
** Revision 1.4  2008-11-04 19:29:07  bg41
** Style changes -bkg
**
** Revision 1.3  2008-09-30 18:27:33  bg41
** cleaned up -Wall warnings -bkg
**
** Revision 1.2  2008-09-26 17:37:01  bg41
** updated header, added footer
** added void as a return type to several functions
** added prototype for addRow() -bkg
*/
