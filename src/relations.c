/*****************************************************************************
**
**    relations.c                     NQ-BG                  Bradley Graber
**                                                      bg41@evansville.edu
**
**    $Rev$
*/


#include <stdlib.h>
#include "presentation.h"
#include "nq.h"

#include "instances.h"


int     addRow( expvec ev );
void    SetupCommuteList();
void    SetupCommute2List();
void SetupNrPcGensList();
long    appendExpVector( gen k, expvec ev, word w, gen * renumber );
void    freeExpVecs( expvec * M );

static word	*Image;

int     EvalSingleRelation( r )
node    *r;
{   
    word    w;
    expvec  ev;
    int     needed;
    
    if( (w = (word)EvalNode( r )) != (void *)0 ) {
        ev = ExpVecWord( w );
        Free( w );
        needed = addRow( ev );
    }
    else {
        printf( "Evaluation " );
        if( !Verbose ) { printf( "of " ); PrintNode( r ); }
        printf( "failed.\n" );
        needed = 0;
    }
    return needed;
}

void	EvalAllRelations() {

	long	t = 0;
	node	*r;

	if( Verbose ) t = RunTime();

	r = FirstRelation();
	while( !EarlyStop && r != (node *)0 ) {
            if( Verbose ) {
                printf( "#    Evaluating: " );
                PrintNode( r ); printf( "\n" );
            }

            if( NumberOfIdenticalGensNode( r ) > 0 )
                EvalIdenticalRelation( r );

            else
                EvalSingleRelation( r );

            r = NextRelation();
	}

	if( Verbose )
	    printf("#    Evaluated Relations (%ld msec).\n",RunTime()-t);
}

/*
**    InitEpim() sets up the map from the generators of a finitely presented
**    group onto the generators of a free abelian group. It also sets up
**    the necessary data structures for collection.
*/
void	InitEpim() {

	long	i, t = 0, nrGens;
	
	if( Verbose ) t = RunTime();

	/* Set the number of central generators to the number of generators
	** in the finite presentation. */
	nrGens = NumberOfAbstractGens();
	NrCenGens = nrGens;

	/* Initialize Exponent[]. */
	Exponent = (exp*) calloc( (NrCenGens+1), sizeof(exp) );
	if( Exponent == (exp*)0 ) {
	    perror( "initEpim(), Exponent" );
	    exit( 2 );
	}

	/* Initialize Weight[]. */
	Weight = (int *)Allocate( (NrCenGens+1)*sizeof(int) );
	for( i = 1; i <= NrCenGens; i++ ) Weight[i] = Class+1;

	/* initialize the epimorphism onto the pc-presentation. */
	Image = (word*)malloc( (nrGens+1)*sizeof(word) );
	if( Image == (word*)0 ) {
	    perror( "initEpim(), Image" );
	    exit( 2 );
	}
	for( i = 1; i <= nrGens; i++ ) {
	    Image[i] = (word)malloc( 2*sizeof(struct gpower) );
	    if( Image[i] == (word)0 ) {
		perror( "initEpim(), Image[]" );
		exit( 2 );
	    }
	    Image[i][0].g = i;
	    Image[i][0].e = (exp)1;
	    Image[i][1].g = EOW;
	    Image[i][1].e = (exp)0;
	}

        SetupCommuteList();
        SetupCommute2List();
        SetupNrPcGensList();

        Commute  = CommuteList[ Class+1 ];
        Commute2 = Commute2List[ Class+1 ];

	if( Verbose )
	    printf("#    Initialized epimorphism (%ld msec).\n",RunTime()-t);
}

int	ExtendEpim() {

	int	j, l, G, nrGens;
	word	w;

	G = NrPcGens;
	nrGens = NumberOfAbstractGens();

	/* If there is an epimorphism, we have to add pseudo-generators
	** to the right hand side of images which are not definitions. */
	for( j = 1; j <= Dimension[1]; j++ )
	    Image[ -Definition[j].h ] =
		  (word)((unsigned long)(Image[-Definition[j].h]) | 0x1);

	for( j = 1; j <= nrGens; j++ )
	    if( !((unsigned long)(Image[j]) & 0x1) ) {
		G++;
		l = 0;
		if( Image[j] != (word)0 ) l = WordLength( Image[ j ] );
		w = (word)malloc( (l+2)*sizeof(gpower) );
		if( Image[j] != (word)0 ) WordCopy( Image[ j ], w );
		w[l].g   = G;   w[l].e   = (exp)1;
		w[l+1].g = EOW; w[l+1].e = (exp)0;
		if( Image[ j ] != (word)0 ) free( Image[ j ] );
		Image[ j ] = w;
                Definition[ G ].h = -j;
                Definition[ G ].g = (gen)0;
	    }

	for( j = 1; j <= Dimension[1]; j++ )
	    Image[ -Definition[j].h ] =
		 (word)((unsigned long)(Image[-Definition[j].h]) & ~0x1);

	return G - NrPcGens;
}

int	ElimAllEpim( n, M, renumber  )
int	n;
expvec	*M;
gen	*renumber;

{	int	i, j, l, nrGens;
	word	w;

	nrGens = NumberOfAbstractGens();

	/* first we eliminate ALL central generators that occur in the
	** epimorphism. */
	for( j = 1; j <= Dimension[1]; j++ )
	    Image[ -Definition[j].h ] =
		(word)((unsigned long)(Image[-Definition[j].h]) | 0x1);

	for( j = 1, i = 0; j <= nrGens; j++ )
	    if( !((unsigned long)(Image[j]) & 0x1) ) {
		l = WordLength( Image[j] );
		w = (word)Allocate( (l+NrCenGens+1-n)*sizeof(gpower) );
		WordCopy( Image[j], w );
		l--;
		l += appendExpVector( w[l].g+1-NrPcGens, M[i], w+l, renumber );

		if( Image[j] != (word)0 ) free( Image[j] );
		if( l == 1 ) {
		    Image[j] = (word)0;
		    free( w );
		}
		else
		    Image[j] = (word)realloc( w, l*sizeof(gpower) );
		i++;
	    }

	for( j = 1; j <= Dimension[1]; j++ )
	    Image[ -Definition[j].h ] =
		(word)((unsigned long)(Image[-Definition[j].h]) & ~0x1);

	return i;
}

void	ElimEpim() {

	long	i, j, h, l, n = 0, t = 0;
	gen	*renumber;
	expvec	*M;
	word	w;
	extern  expvec	*MatrixToExpVecs();

	if( Verbose ) t = RunTime();

	M = MatrixToExpVecs();

	renumber = (gen*) malloc( (NrCenGens+1) * sizeof(gen) );
	if( renumber == (gen*)0 ) {
	    perror( "ElimEpim(), renumber" );
	    exit( 2 );
	}

	/* first assign a new number to each generator which is
	   not to be eliminated. */
	for( h = 1, i = 0; h <= NrCenGens; h++ )
	    if( i >= NrRows || h != Heads[i] )
	        renumber[ h ] = h - n;
	    else if( M[i][h] != (exp)1 ) {
                                      /* h will become a torsion element */
		renumber[ h ] = h - n;
		Exponent[ renumber[h] ] = M[i][h];
		i++;
	    }
	    else {                    /* h will be eliminated. */
		n++;
		i++;
	    }

	/* allocate memory for Power[], note that n is the number of
	   generators to be eliminated. */
	Power = (word*) malloc( (NrCenGens-n+1) * sizeof(word) );
	if( Power == (word*)0 ) {
	    perror( "ElimEpim(), Power" );
	    exit( 2 );
	}

	/* allocate memory for Definition[]. */
	Definition = (def*)malloc( (NrCenGens-n+1)*sizeof(def) );
	if( Definition == (def*)0 ) {
	    perror( "ElimEpim(), Definition" );
	    exit( 2 );
	}

	/* Now eliminate and renumber generators. */
	for( h = 1, i = 0; h <= NrCenGens; h++ ) {
	    /* h runs through all generators. Only if a generator is
	    ** encountered that occurs as the i-th head we have to work. */
	    if( i >= NrRows || h != Heads[i] ) {
		/* generator i survives and does not get a power relation */
		Image[h][0].g = renumber[ h ];
		Definition[ renumber[h] ].h = -h;
		Definition[ renumber[h] ].g = 0;
		continue;
	    }

	    /* From here on we have that  h = Heads[i]. */
	    w = (word)malloc( (NrCenGens+1-h)*sizeof(gpower) );
	    if( w == (word)0 ) {
		perror( "ElimEpim(), w" );
		exit( 2 );
	    }

	    /* Copy the exponent vector M[i] into w. */
	    for( l = 0, j = h+1; j <= NrCols; j++ )
		if( M[i][j] > (exp)0 ) {
		    w[l].g = -renumber[j];
		    w[l].e = M[i][j];
		    l++;
		}
		else if( M[i][j] < (exp)0 ) {
		    w[l].g = renumber[j];
		    w[l].e = -M[i][j];
		    l++;
		}
	    w[l].g = EOW;
	    w[l].e = (exp)0;
	    l++;

	    if( M[i][h] == (exp)1 ) {
		/* generator h has to be eliminated. */
		free( Image[h] );
		Image[h] = (word)realloc( w, l*sizeof(gpower) );
	    }
	    else {
		/* generator h survives and gets a power relation. */
		Image[h][0].g = renumber[ h ];
		Definition[ renumber[h] ].h = -h;
		Definition[ renumber[h] ].g = 0;
		Power[ renumber[h]]   = (word)realloc( w, l*sizeof(gpower) );
	    }
	    i++;
	}

	/* Now adjust the sizes of the arrays */
	Commute = (gen*)realloc( Commute, (NrCenGens+1-n)*sizeof(gen) );
	Exponent = (exp*)realloc( Exponent, (NrCenGens+1-n)*sizeof(exp) );

	free( renumber );

	freeExpVecs( M );
	NrCenGens -= n;

	if( Verbose )
	    printf("#    Eliminated generators (%ld msec).\n",RunTime()-t);
}

void	PrintEpim() {

	long	i, nrGens;

	if( Image == (word*)0 ) {
	    printf( "#    No map set.\n" );
	    return;
	}

	nrGens = NumberOfAbstractGens();
	for( i = 1; i <= nrGens; i++ ) {
	    printf( "#    " );
            printf( "%s |---> ", GenName(i) );
	    printWord( Image[i], 'A' );
	    putchar( '\n' );
	}
}

word	Epimorphism( g )
gen	g;

{	/*  Do we have an abstract generator or an identical generator ? */
        if( g <= NumberOfAbstractGens() )
            return Image[g];

        if( Instances == (word *)0 ) {
            printf( "##  Instances not initialised\n" );
            return (word)0;
        }

        g = IdenticalGenNumberNode[ g - NumberOfAbstractGens() ];
        return Instances[ g ];
}

/**********************************
** $Log: relations.c,v $
** Revision 1.6  2008-09-30 18:16:05  bg41
** initialized a few variables
** switched some %d to %ld
** removed some unused variables -bkg
**
** Revision 1.5  2008-09-26 17:30:22  bg41
** added prototypes for addRow(), SetupCommuteList(), SetupCommute2List()
** SetupNrPcGensList(), appendExpVector(), freeExpVecs() -bkg
**
** Revision 1.4  2008-09-25 20:05:19  bg41
** fixed footer -bkg
**
** Revision 1.3  2008-09-25 19:26:08  bg41
** #include <stdlib> added to fix incompatible implicit declaration warning -bkg
**
** Revision 1.2  2008-09-25 19:24:59  bg41
** modified header & added footer -bkg
*/
