/*************************************************************************
**
**    combicol.c                    NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Id: combicol.c,v 1.5 2008-11-12 16:53:09 bg41 Exp $
*/

#include "mem.h"
#include "pc.h"
#include "pcarith.h"
#include "macro.h"
#include "collect.h"
#include "time.h"

long	RunTime ();
void	AddWord( expvec lhs, word w, exp we );

static	
int	Error( char * str, gen g )
{
   printf( "Error in CombiCollect() while treating generator %d:\n", 
           (int)g );
   printf( "      %s\n", str );

   CombiCollectionTime += RunTime();

   return 7;
}

/*************************************************************************
**  Combinatorial Collection from the left uses the same stacks as the
**  plain from the left collector.
*/

extern	word	WordStack[];
extern	exp	WordExpStack[];
extern	word	GenStack[];
extern	exp	GenExpStack[];
extern	word	*Generators;

int	Sp;

#define STACKHEIGHT	(1 << 16)

#define CheckOverflow( n ) \
        if( (((n) << 1) >> 1) != n ) \
           Error( "Possible integer overflow", n )

void	ReduceExponent( expvec ev, gen g ) 
{
   if( ev[ g ] >= Exponent[ g ] ) {
      if( Power[g] != (word)0 ) 
         AddWord( ev, Power[g], ev[ g ] / Exponent[ g ] );
      ev[ g ] %= Exponent[ g ];
   }
}

int	StackReduceExponent( expvec ev, gen g )
{
   gen h;

   if( ev[ g ] >= Exponent[ g ] ) {
      if( Power[ g ] != (word)0 ) {
         /* Need to put part of the exponent vector on the stack. */
         for( h = Commute[ g ]; h > g; h-- ) {
            if( ev[ h ] != (exp)0 ) {
               if( ++Sp == STACKHEIGHT ) 
                  return Error( "Out of stack space", g );
               if( ev[ h ] > (exp)0 ) {
                  WordStack[ Sp ] = Generators[  h ]; 
                  WordExpStack[ Sp ] = 1;
                  GenExpStack[ Sp ] = ev[ h ]; 
               }
               else {
                  WordStack[ Sp ] = Generators[ -h ];
                  WordExpStack[ Sp ] = 1;
                  GenExpStack[ Sp ] = -ev[ h ]; 
               }
               ev[ h ] = (exp)0;
               GenStack[ Sp ] = WordStack[ Sp ]; 
            }
         }
         AddWord( ev, Power[ g ], ev[ g ] / Exponent[ g ] );
      }
      ev[ g ] %= Exponent[ g ];
   }
   return 0;
}

void	AddWord( expvec lhs, word w, exp we ) 
{
   gen    g;

   for( ; w->g != EOW && w->g <= NrPcGensList[Class+1]; w++ ) {
      if( w->g > (gen)0 ) { 
         g =  w->g; 
         lhs[ g ] += we * w->e; 
      }
      else {
         g = -w->g; 
         lhs[ g ] -= we * w->e; 
      }
      CheckOverflow( lhs[ g ] );
      if( Exponent[ g ] != (exp)0 ) 
         ReduceExponent( lhs, g );
   }
}

int	CombiCollect( expvec lhs, word rhs, exp e ) 
{
   word * ws = WordStack;
   exp * wes = WordExpStack;
   word * gs = GenStack;
   exp * ges = GenExpStack;
   word ** C = Conjugate;
   word * P  = Power;

   word   w;
   gen ag,  g,  h,  hh;

   CombiCollectionTime -= RunTime();

   Sp = 0;

   ws[ Sp ] = rhs;
   gs[ Sp ] = rhs;
   wes[ Sp ] = e;
   ges[ Sp ] = rhs->e;

   while( Sp >= 0 ) {
      if( (g = gs[ Sp ]->g) != EOW && g <= NrPcGensList[Class+1] ) {
         ag = abs( g );
         if( g < 0 && Exponent[-g] != (exp)0 ) 
            return Error( "Inverse of a generator with power relation", ag );
         if( Commute[ag] == ag ) {
            /*
            **  Take the exponent of the first generator from the stack
            **  not from the word.  Both are identical if the word is a
            **  conjugate.  The differ if a generator-exponent pair was 
            **  pushed onto the stack.
            **  In that case w->e is 1 and ges[ Sp ] is the exponent. 
            */
            w = gs[ Sp ]; 
            if( w->g > (gen)0 ) {
               g =  w->g; 
               lhs[ g ] += ges[ Sp ]; 
            }
            else {
               g = -w->g;
               lhs[ g ] -= ges[ Sp ];
            }
            CheckOverflow( lhs[ g ] );
            if( Exponent[ g ] != (exp)0 ) 
               ReduceExponent( lhs, g );

            for( w++; w->g != EOW && w->g <= NrPcGensList[Class+1]; w++ ) {
               if( w->g > (gen)0 ) {
                  g =  w->g; 
                  lhs[ g ] += w->e;
               }
               else { 
                  g = -w->g; 
                  lhs[ g ] -= w->e;
               }
               CheckOverflow( lhs[ g ] );
               if( Exponent[ g ] != (exp)0 ) 
                  ReduceExponent( lhs, g );
            }
            gs[ Sp ] = w;
            continue;
         }

         else if( 3*Wt(ag) > Class+1 ) {
            /*
            ** Move the generator g to its correct position in the 
            ** exponent vector without stacking conjugates.  Because
            ** of the class condition we can add the necessary
            ** *commutators* into the exponent vector. 
            */ 
            for( h = Commute[ ag ]; h > ag; h-- ) {
               if( lhs[ h ] != (exp)0 ) {
                  if( lhs[ h ] > (exp)0 )
                     AddWord( lhs, C[  h ][ g ] + 1,  lhs[ h ] * ges[ Sp ] );
                  else
                     AddWord( lhs, C[ -h ][ g ] + 1, -lhs[ h ] * ges[ Sp ] );
               }
            }

            lhs[ ag ] += sgn(g) * ges[ Sp ];
            CheckOverflow( lhs[ ag ] );

            gs[ Sp ]++;
            ges[ Sp ] = gs[ Sp ]->e;

            if( Exponent[ ag ] != (exp)0 ) 
               StackReduceExponent( lhs, ag );
            continue;
         }
         else {
            lhs[ ag ] += sgn(g);
            if( --ges[ Sp ] == (exp)0 ) {
               /*
               ** The power of the generator g will have been moved
               ** completely to its correct position after this
               ** collection step. Therefore advance the generator
               ** pointer. 
               */
               gs[ Sp ]++; 
               ges[ Sp ] = gs[ Sp ]->e;
            }
            // Add in commutators until Wt([h,g,h]) <= Class+1
            for( h = Commute[ ag ]; h > Commute2[ ag ]; h-- ) {
               if( lhs[ h ] != (exp)0 ) {
                  if( lhs[ h ] > (exp)0 )
                     AddWord( lhs, C[  h ][ g ] + 1,  lhs[ h ] );
                  else
                     AddWord( lhs, C[ -h ][ g ] + 1, -lhs[ h ] );
               }
            }

            /*
            ** If we still have to move across generators, then we have 
            ** to put generators onto the stack.  Find the point from 
            ** where collection has to happen. 
            */
            while( h > ag ) {
               if( lhs[ h ] != (exp)0 && 
                   C[h][ag] != (word)0 && 
                   (C[h][ag]+1)->g != EOW ) 
                  break;
               h--;
            }

            /* Now put generator exponent pairs on the stack. */
            if(     h > ag || 
                  ( Exponent[ ag ] > (exp)0 && 
                    lhs[ ag ] >= Exponent[ ag ] && 
                    Power[ ag ] != (word)0 
                  ) 
               ) {
               for( hh = Commute[ag]; hh > h; hh-- ) {
                  if( lhs[ hh ] != (exp)0 ) {
                     if( ++Sp == STACKHEIGHT ) 
                        return Error( "Out of stack space", ag );
                     if( lhs[ hh ] > (exp)0 ) {
                        gs[ Sp ]  = ws[ Sp ] = Generators[ hh ];
                        wes[ Sp ] = 1; 
                        ges[ Sp ] = lhs[ hh ];
                     }
                     else {
                        gs[ Sp ]  = ws[ Sp ] = Generators[ -hh ];
                        wes[ Sp ] = 1;
                        ges[ Sp ] = -lhs[ hh ];
                     }
                     lhs[hh] = (exp)0;
                  }
               }
            }

            // Now move the generator g to its correct position
            // in the exponent vector lhs.
            for( ; h > ag; h-- ) {
               if( lhs[h] != (exp)0 ) {
                  if( ++Sp == STACKHEIGHT )
                     return Error( "Out of stack space", ag );
                  if( lhs[ h ] > (exp)0 ) {
                     gs[ Sp ]  = ws[ Sp ] = C[ h ][ g ];
                     wes[ Sp ] = lhs[h]; lhs[ h ] = (exp)0;
                     ges[ Sp ] = gs[ Sp ]->e;
                  }
                  else {
                     gs[ Sp ]  = ws[ Sp ] = C[ -h ][ g ];
                     wes[ Sp ] = -lhs[h];
                     lhs[ h ] = (exp)0;
                     ges[ Sp ] = gs[ Sp ]->e;
                  }
               }
            }
         }

         CheckOverflow( lhs[ag] );
        
         if( Exponent[ag] != (exp)0 ) {
            while( lhs[ag] >= Exponent[ag] ) {
               if( (rhs = P[ ag ]) != (word)0 ) {
                  if( ++Sp == STACKHEIGHT )
                     return Error( "Out of stack space", ag );
                  gs[ Sp ] = ws[ Sp ] = rhs;
                  wes[ Sp ] = (exp)1;
                  ges[ Sp ] = gs[ Sp ]->e;
               }
               lhs[ ag ] -= Exponent[ ag ];
            }
         }
      }
      else {
         /*
         **  the top word on the stack has been examined completely,
         **  now check if its exponent is zero.
         */
         if( --wes[ Sp ] == (exp)0 ) {
            /*
            ** All powers of this word have been treated, so
            ** we have to move down the stack.
            */
            Sp--;
         }
         else {
            gs[ Sp ] = ws[ Sp ];
            ges[ Sp ] = gs[ Sp ]->e;
         }
      }
   }
   
   CombiCollectionTime += RunTime();

   return 0;
}


/*************************************************************************
** $Log: combicol.c,v $
** Revision 1.5  2008-11-12 16:53:09  bg41
** Style changes -bkg
**
** Revision 1.4  2008-11-04 19:06:44  bg41
** Style changes -bkg
**
** Revision 1.3  2008-09-26 21:35:08  bg41
** commented line  "GenStack[ Sp ]->e;" due to its uselessness
** removed the variable of type word "conj" because it is not used
** added a return 0 statement to the end of StackReduceExponent() -bkg
**
** Revision 1.2  2008-09-26 15:46:43  bg41
** fixed header, added footer
** added a prototype for RunTime()
** added a prototype for AddWord()
** added return type of int to Error()
** added return type of int to StackReduceExponent()
** added return type of void to ReduceExponent()
** added return type of void to AddWord()   -bkg
*/
