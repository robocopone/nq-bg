/*************************************************************************
**
**    collect.c                     NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Rev$
*/

#include <stdlib.h>
#include <string.h>
#include "mem.h"
#include "pc.h"
#include "pcarith.h"
#include "macro.h"
#include "collect.h"
#include "time.h"


long	RunTime ();

int	UseSimpleCollector = 0;
int	UseCombiCollector  = 0;

static	
int	Error( char * str, gen g )
{
   printf( "Error in Collect() while treating generator %d:\n", (int)g );
   printf( "      %s\n", str );

   SimpleCollectionTime += RunTime();
	
   return 7;
}

/*************************************************************************
** Collection from the left needs 4 stacks during the collection.
**
** The word stack containes conjugates of generators, that were created
** by moving a generator through the exponent vector to its correct
** place or it containes powers of generators.
**
** The word exponent stack containes the exponent of the corresponding
** word in the word stack.
**
** The generator stack containes the current position in the corresponding
** word in the word stack.
**
** The generator exponent stack containes the exponent of the generator
** determined by the corrsponding entry in the generator stack.
**
** The maximum number of elements on each stack is determined by the macro
** STACKHEIGHT.                                                             
*/

#define	STACKHEIGHT	(1 << 16)

word	WordStack[STACKHEIGHT];
exp	WordExpStack[STACKHEIGHT];
word	GenStack[STACKHEIGHT];
exp	GenExpStack[STACKHEIGHT];

int	SimpleCollect( expvec lhs, word rhs, exp e )
{
   word * ws = WordStack;
   exp * wes = WordExpStack;
   word * gs = GenStack;
   exp * ges = GenExpStack;
   word ** C = Conjugate;
   word * P = Power;
   int sp = 0;
   gen	g, h, ag;

   SimpleCollectionTime -= RunTime();

   ws[ sp ] = rhs;
   gs[ sp ] = rhs;
   wes[ sp ] = e;
   ges[ sp ] = rhs->e;

   while ( sp >= 0 ) {
      if ( (g = gs[ sp ]->g) != EOW ) {
         ag = abs( g );
         if ( g < 0 && Exponent[-g] != (exp)0 ) 
            return Error( "Inverse of a generator with power relation",
                           ag );
         e = (ag == Commute[ag]) ? gs[ sp ]->e : (exp)1;
         if ( (ges[ sp ] -= e) == (exp)0 ) {
            /*
            ** The power of the generator g will have been moved
            ** completely to its correct position after this
            ** collection step. Therefore advance the generator
            ** pointer. 
            */
            gs[ sp ]++; 
            ges[ sp ] = gs[ sp ]->e;
         }
         /* 
         ** Now move the generator g to its correct position
         ** in the exponent vector lhs. 
         */
         for ( h = Commute[ag]; h > ag; h-- ) {
            if ( lhs[h] != (exp)0 ) {
               if ( ++sp == STACKHEIGHT )
                  return Error( "Out of stack space", ag );
               if ( lhs[ h ] > (exp)0 ) {
                  gs[ sp ]  = ws[ sp ] = C[ h ][ g ];
                  wes[ sp ] = lhs[h]; lhs[ h ] = (exp)0;
                  ges[ sp ] = gs[ sp ]->e;
               }
               else {
                  gs[ sp ]  = ws[ sp ] = C[ -h ][ g ];
                  wes[ sp ] = -lhs[h]; lhs[ h ] = (exp)0;
                  ges[ sp ] = gs[ sp ]->e;
               }
            }
         }
         lhs[ ag ] += e * sgn(g);
         if ( ((lhs[ag] << 1) >> 1) != lhs[ag] )
            return Error( "Possible integer overflow", ag );
         if ( Exponent[ag] != (exp)0 ) {
            while ( lhs[ag] >= Exponent[ag] ) {
               if ( (rhs = P[ ag ]) != (word)0 ) {
                  if ( ++sp == STACKHEIGHT )
                     return Error( "Out of stack space", ag );
                  gs[ sp ] = ws[ sp ] = rhs;
                  wes[ sp ] = (exp)1;
                  ges[ sp ] = gs[ sp ]->e;
               }
               lhs[ ag ] -= Exponent[ ag ];
               if ( ((lhs[ag] << 1) >> 1) != lhs[ag] )
                  return Error( "Possible integer overflow", ag );
            }
         }
      }
      else {
         /*
         ** the top word on the stack has been examined completely,
         ** now check if its exponent is zero. 
         **
         ** All powers of this word have been treated, 
         ** so we have to move down in the stack.
         */
         if( --wes[ sp ] == (exp)0 )
            sp--;
         else {
            gs[ sp ] = ws[ sp ];
            ges[ sp ] = gs[ sp ]->e;
         }
      }
   }
   SimpleCollectionTime += RunTime();
   return 0;
}

int	Collect( expvec lhs, word rhs, exp e ) 
{
   int ret,  storeClass, i;
   expvec lhs2;

   storeClass = Class;
   if( Class < 0 ) 
      Class = 0;

   Commute  = CommuteList[ Class+1 ];
   Commute2 = Commute2List[ Class+1 ];

   if( UseSimpleCollector && UseCombiCollector ) {
      lhs2 = (expvec)Allocate( (NrPcGens+NrCenGens+1) * sizeof(exp) );
      memcpy( lhs2, lhs, (NrPcGens+NrCenGens+1) * sizeof(exp) );
      ret = SimpleCollect( lhs, rhs, e );
      CombiCollect( lhs2, rhs, e );

      if( memcmp( lhs, lhs2, (NrPcGens+NrCenGens+1) * sizeof(exp) ) != 0 ) {
         for( i = 1; i <= NrPcGens + NrCenGens; i++ )
            if( lhs[i] != lhs2[i] )
               printf( "lhs[%d] = %d    lhs2[%d] = %d\n", 
                        i, (int) lhs[i], 
                        i, (int) lhs2[i] );
         printf( "Collector mismatch\n" );
      }
      Free( lhs2 );
   }
  
   else if( UseCombiCollector ) 
      ret = CombiCollect( lhs, rhs, e );

   else
      ret = SimpleCollect( lhs, rhs, e );

   Class = storeClass;
   return ret;
}

/*************************************************************************
**    Solve the equation   u x = v   for x.
*/
word	Solve( word u, word v )
{
   word	x;
   gpower y[2];
   gen g;
   long	lv, lx;
   exp ev;
   expvec uvec;
	
   y[1].g = EOW; 
   y[1].e = (exp)0;

   uvec = (expvec)calloc( (NrPcGens+NrCenGens+1), sizeof(exp) );
   if( uvec == (expvec)0 ) {
      perror( "Solve(), uvec" );
      exit( 2 );
   }

   x = (word)malloc( (NrPcGens+NrCenGens+1)*sizeof(gpower) );
   if( x == (word)0 ) {
      perror( "Solve(), x" );
      exit( 2 );
   }

   if( Collect( uvec, u, (exp)1 ) ) {
      Free( x );
      Free( uvec );
      return (word)0;
   }

   for( lv = lx = 0, g = 1; g <= NrPcGens+NrCenGens; g++ ) {
      if( v[lv].g == g )
         ev =  v[ lv++ ].e;
      else if( v[lv].g == -g ) 
         ev = -v[ lv++ ].e;
      else 
         ev = (exp)0;

      if( ev != uvec[g] ) {
         if( ev > uvec[g] ) {			/* ev - uvec[g] > 0 */
            y[0].g = x[lx].g  = g;
            y[0].e = x[lx++].e = ev - uvec[g];
         }
         else if( Exponent[g] != (exp)0 ) {	/* ev - uvec[g] < 0 */
            y[0].g = x[lx].g  = g;
            y[0].e = x[lx++].e = ev - uvec[g] + Exponent[g];
         }
         else {
            y[0].g = x[lx].g   = -g;
            y[0].e = x[lx++].e = uvec[g] - ev;
         }
         if( Collect( uvec, y, (exp)1 ) ) {
            Free( x );
            Free( uvec );
            return (word)0;
         }
      }
   }

   Free( uvec );

   x[lx].g = EOW;
   x[lx++].e = (exp)0;

   x = (word)realloc( x, lx*sizeof(gpower) );
   if( x == (word)0 ) {
      perror( "Solve(), x (resize)" );
      exit( 2 );
   }
   return x;
}

word	Invert( word u )
{
   gpower id;

   id.g = EOW;
   id.e = (exp)0;
   return Solve( u, &id );
}

word	Multiply( word u, word v )
{
   expvec ev;
   word w;

   ev = (expvec)Allocate( (NrPcGens+NrCenGens+1)*sizeof(exp) );

   if( Collect( ev, u, (exp)1 ) || Collect( ev, v, (exp)1 ) ) {
      Free( ev );
      return (word)0;
   }

   w = WordExpVec( ev );
   Free( ev );

   return w;
}

word	Exponentiate( word u, int n )
{
   word v;
   expvec ev;
   int copied_u = 0;

   if( n < 0 ) {
      if( (u = Invert( u )) == (word)0 ) 
         return (word)0;
      copied_u = 1;
      n = -n;
   }

   ev = (expvec)Allocate( (NrPcGens+NrCenGens+1)*sizeof(exp) );

   while( n > 0 ) {
      if( n % 2 ) {
         if( Collect( ev, u, (exp)1 ) ) {
	    if( copied_u ) Free( u );
               Free( ev );
            return (word)0;
         }
      }
      n /= 2;
      if( n > 0 ) {
         if( (v = Multiply( u, u )) == (word)0 ) {
            if( copied_u ) Free( u );
               Free( ev );
            return (word)0;
         }
         if( copied_u )
            Free( u );
         u = v;
         copied_u = 1;
      }
   }

   if( copied_u ) 
      Free( u );
   u = WordExpVec( ev );
   Free( ev );
   return u;
}

/*************************************************************************
**  Solve the equation vu x = uv for x.  The solution is the commutator
**  [u,v].  
**
**  In step i we have to solve the equation    v'u' x = u''v''.
**  That equation holds for the i-th generator if
**
**                 v'[i] + u'[i] + x[i] = u''[i] + v''[i]
**
**  Hence          x[i] = u''[i] + v''[i] - (v'[i] + u'[i]).
**  To prepare the (i+1)-th step we need to collect i^x[i] first across
**  u' and then across v' on the left hand side of the equation.  On the
**  right hand side of the equation we need to collect i^v''[i] across
**  u''.  This has the effect of moving the occurrances of generator i
**  to the left on both sides of the equation such that it can be
**  cancelled on both sides of the equation.
*/

word    Commutator( word u, word v )
{
   expvec u1, u2, v1, v2, x;
   gpower y[2];
   word w = (word)0;
   int i;

   y[0].g = y[1].g = EOW;
   y[0].e = y[1].e = (exp)0;

   u1 = ExpVecWord( u ); 
   u2 = ExpVecWord( u );
   v1 = ExpVecWord( v ); 
   v2 = ExpVecWord( v );
   x  = ExpVecWord( y );
   for( i = 1; i <= NrPcGens+NrCenGens; i++ ) {
      x[i] = u2[i]+v2[i] - (v1[i] + u1[i]);
      if( Exponent[i] != (exp)0 ) {
         while( x[i] < (exp)0 )
            x[i] += Exponent[i];
         if( x[i] >= Exponent[i] ) 
            x[i] -= Exponent[i];
      }
      if(  x[i] != (exp)0 ) {
         if(  x[i] > (exp)0 ) {
            y[0].g =  i; 
            y[0].e =   x[i];
         }
         else { 
            y[0].g = -i; 
            y[0].e =  -x[i]; 
         }
         if( Collect( u1, y, (exp)1 ) ) 
            goto exit;
      }
      if( u1[i] != (exp)0 ) {
         if( u1[i] > (exp)0 ) {
            y[0].g =  i; 
            y[0].e =  u1[i];
         }
         else { 
            y[0].g = -i; 
            y[0].e = -u1[i]; 
         }
         if( Collect( v1, y, (exp)1 ) ) 
            goto exit;
      }
      if( v2[i] != (exp)0 ) {
         if( v2[i] > (exp)0 ) { 
            y[0].g =  i; 
            y[0].e =  v2[i]; 
         }
         else { 
            y[0].g = -i; 
            y[0].e = -v2[i]; 
         }
         if( Collect( u2, y, (exp)1 ) ) 
            goto exit;
      }
   }
    
   w = WordExpVec( x );

   exit: Free( u1 ); Free( u2 ); Free( v1 ); Free( v2 ); Free( x );
    
   return w;
}

word	Commutator2( word v, word w )
{
   expvec ev;
   word vw, wv, vwvw;

   ev = ExpVecWord( v );
   if( Collect( ev, w, (exp)1 ) ) {
      Free( ev );
      return (word)0;
   }
   vw = WordExpVec( ev );
   Free( ev );

   ev = ExpVecWord( w );
   if( Collect( ev, v, (exp)1 ) ) {
      Free( ev );
      Free( vw );
      return (word)0;
   }
   wv = WordExpVec( ev );
   Free( ev );

   vwvw = Solve( wv, vw );
   Free( vw );
   Free( wv );

   return vwvw;
}

/************************************************************************
** $Log: collect.c,v $
** Revision 1.9  2008-11-12 16:36:34  bg41
** style changes -bkg
**
** Revision 1.8  2008-11-04 18:32:00  bg41
** Style changes -bkg
**
** Revision 1.7  2008-09-30 17:35:02  bg41
** cast a couple variables to ints for printf -bkg
**
** Revision 1.6  2008-09-26 15:49:31  bg41
** added return type of int to Error()
** added prototype for RunTime() -bkg
**
** Revision 1.5  2008-09-25 19:20:00  bg41
** modified the header -bkg
**
** Revision 1.4  2008-09-25 19:11:50  bg41
** added a couple #includes to fix compiler errors -bkg
**
** Revision 1.3  2008-09-25 18:41:30  bg41
** fixed footer -bkg
**
** Revision 1.2  2008-09-25 18:40:20  bg41
** modified header & footer -bkg
*/
