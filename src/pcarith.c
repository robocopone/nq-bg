/*************************************************************************
**
**    pcarith.c                     NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Rev$
**
**  This file contains an arithmetic for elements of a group that is
**  given by a polycyclic presentation. The elements are in generator
**  exponent form. Multiplication is performed by a collection process.
**  There are the following functions :
**
**  int  WordCmp( u, w )  ....... Compare the two words u and w and
**                                return 0, if the words are equal and
**                                1 otherwise.
**  void WordCopy( u, w ) ....... Copy the word u to the word w. It is
**                                assumed that storage for w has already
**                                been allocated.
**  int  WordLength( u )  ....... Return the length of the word u, i.e.,
**                                the number of powers of generators in u.
**  word WordGen( g )     ....... Return the image under the epimorphism
**                                of the generator number g.
**  word WordMult( u, w ) ....... Return the product of the word u and
**                                the word w and free u and w.
**  word WordPow( u, pn ) ....... Return the word u raised to the power
**                                of (*pn). Free u.
**  word WordConj( u, w ) ....... Return the conjugate of the word u by
**                                the word w and free u and w.
**  word WordComm( u, w ) ....... Return the commutator [u,w] of the
**                                  words u and w. Free u and w.
**  word WordEngel( u, w, n ) ... Return the Engel-n commutator [u, n w]\
**                                of the words u and w.  Free u and w.
**                                the word w and free u and w.
**  word WordRel( u, w )  ....... Return the quotient u^-1 * w of the
**                                words u and w. Free u and w.
**  void WordInit( f )    ....... Initialize the evaluator with this
**                                arithmetic module. f is the function
**                                used by this module to obtain a
**                                generator through its number.
**  void WordPrint( u )   ....... Print the word u. The word u is not
**                                freed.
*/

#include "presentation.h"
#include "pc.h"
#include "collect.h"

static	word	(*PcGenerator)();

void	WordCopyExpVec( expvec ev, word w )
{
   long l;
   gen g;

   for ( l = 0, g = 1; g <= NrPcGensList[Class > 0 ? Class+1 : 1]; g++ ) {
      if ( ev[g] != (exp)0 ) {
         if ( ev[g] > (exp)0 ) { 
            w[l].g = g; 
            w[l].e = ev[g];
         }
         else {
            w[l].g = -g; 
            w[l].e = -ev[g];
         }
         l++;
      }
   }
   w[l].g = EOW; 
   w[l].e = (exp)0;
}

word	WordExpVec( expvec ev )
{
   long l;
   gen g;
   word w;

   for ( l = 0, g = 1; g <= NrPcGensList[Class > 0? Class+1 : 1]; g++ )
      if ( ev[g] != (exp)0 ) 
         l++;

   w = (word)Allocate( (l+1)*sizeof(gpower) );

   WordCopyExpVec( ev, w );
   return w;
}

expvec	ExpVecWord( word w )
{
   expvec ev;

   ev = (expvec)Allocate( (NrPcGens+NrCenGens+1) * sizeof(exp) );

   if ( w != (word)0 ) {
      while ( w->g != EOW ) {
         if ( w->g > 0 )
            ev[ w->g ] = w->e;
         else           ev[ -w->g ] = -w->e;
         w++;
      }
   }
   return ev;
}

int	WordCmp( word u, word w )
{
   if ( u == w ) 
      return 0;
   while ( u->g == w->g && u->e == w->e ) {
      if ( u->g == EOW )
         return 0;
      u++;
      w++;
   }
   return 1;
}

void	WordCopy( word u, word w )
{
   while ( u->g != EOW )
      *w++ = *u++;
   *w = *u;
}

int	WordLength(  word w )
{
   int l = 0;

   while ( w->g != EOW ) {
      w++;
      l++;
   }
   return l;
}

word	WordGen( gen g )
{
   word w;
   int l;

   if ( g == 0 ) {
      w = (word)Allocate( sizeof( gpower ) );
      w[0].g = EOW;
   }
   else {
      if ( (*PcGenerator)(g) == (word)0 ) 
         return (word)0;
      l = WordLength( (*PcGenerator)(g) );
      w = (word)Allocate( (l+1)*sizeof( gpower ) );
      WordCopy( (*PcGenerator)(g), w );
   }
   return w;
}

word	WordMult( word u, word w )
{
   expvec ev;

   ev = ExpVecWord( u );
   Free( (void *)u ); 
   if ( Collect( ev, w, (exp)1 ) ) {
      Free( (void *)w );
      Free( (void *)ev );
      return (word)0;
   }

   Free( (void *)w );
   w = WordExpVec( ev );
   Free( (void *)ev );
   return w;
}

word	WordPow( word w, int * pn )
{
   expvec ev;
   word ww;
   int n;

   n = * pn;
   if ( n == 0 ) {
      Free( (void *)w );
      return WordGen( 0 );
   }
   if ( n < 0 ) {
      ww = Invert( w );
      Free( (void *)w );
      w = ww;
      n = -n;
   }

   if ( n == 1 )
      return w;

   ev = ExpVecWord( w );
   if ( Collect( ev, w, (exp)(n-1) ) ) {
      Free( (void *)w );
      Free( (void *)ev );
      return (word) 0;
   }

   Free( (void *)w );
   w = WordExpVec( ev );
   Free( (void *)ev );
   return w;
}

word	WordConj( word u, word w )
{
   word uw, x;
   expvec ev;

   /* x = u^w = w^-1 * u * w   <===>   w * x = u * w. */
   ev = ExpVecWord( u );
   Free( (void *)u );

   if ( Collect( ev, w, (exp)1 ) ) {
      Free( (void *)ev );
      Free( (void *)w );
      return (word)0;
   }
   uw = WordExpVec( ev );
   Free( (void *)ev );

   x = Solve( w, uw );
   Free( (void *)w );
   Free( (void *)uw );

   return x;
}

word	WordComm( word u, word w )
{
   word x;

   x = Commutator( u, w );

   Free( u );
   Free( w );
   return x;
}

word	WordEngel( int u, int w, int * e )
{
   word x;
   extern word EngelCommutator(); 

   x = EngelCommutator( u, w, *e );

   Free( u );
   Free( w );
   return x;
}



word	WordRel( word u, word w )
{
   word x;

   /* 
   ** The relation u = w is interpreted as
   ** x = u^-1 * w, which is equivalent to
   ** u * x = w.
   */
   x = Solve( u, w );
   Free( (void *)u );
   Free( (void *)w );

   return x;
}

void	WordInit( word (*generator)() )
{
   PcGenerator = generator;

   SetEvalFunc( TGEN,  (void *(*)())WordGen );
   SetEvalFunc( TMULT, (void *(*)())WordMult );
   SetEvalFunc( TPOW,  (void *(*)())WordPow );
   SetEvalFunc( TCONJ, (void *(*)())WordConj );
   SetEvalFunc( TCOMM, (void *(*)())WordComm );
   SetEvalFunc( TREL,  (void *(*)())WordRel );
   SetEvalFunc( TDRELL,(void *(*)())WordRel );
   SetEvalFunc( TDRELR,(void *(*)())WordRel );
   SetEvalFunc( TENGEL,(void *(*)())WordEngel );
}

void	WordPrint( word gs )
{
   if ( gs->g != EOW ) {
      if ( gs->g > 0 ) {
         PrintGen( gs->g );
         if ( gs->e > (exp)1 ) 
#ifdef LONGLONG
            printf( "^%Ld", gs->e );
#else
            printf( "^%d", gs->e );
#endif
      }
      else {
         PrintGen( -gs->g );
#ifdef LONGLONG
         printf( "^-%Ld", gs->e );
#else
         printf( "^-%d", gs->e );
#endif
      }
   }
   else {
      printf( "1" );
      return;
   }

   gs++;
    
   while ( gs->g != EOW ) {
      putchar( '*' );
      if ( gs->g > 0 ) {
         PrintGen( gs->g );
         if ( gs->e > (exp)1 )
#ifdef LONGLONG
            printf( "^%Ld", gs->e );
#else
            printf( "^%d", gs->e );
#endif
      }
      else {
         PrintGen( -gs->g );
#ifdef LONGLONG
         printf( "^-%Ld", gs->e );
#else
         printf( "^-%d", gs->e );
#endif
      }
      gs++;
   }
}

/*************************************************************************
** $Log: pcarith.c,v $
** Revision 1.3  2008-11-18 17:03:41  bg41
** Style changes -bkg
**
*/
