/*************************************************************************
**
**    nq.c                          NQ-BG                  Bradley Graber
**                                                    bg41@evansville.edu
**
**    $Id: nq.c,v 1.11 2008-11-18 16:26:03 bg41 Exp $
*/

#include <stdlib.h>
#include <ctype.h>
#include <unistd.h>
#include "nq.h"
#include "engel.h"

void	PrintCollectionTimes();
void	TimeOutOn();
void	TimeOutOff();
void	PrintRawGapPcPres();
void	PrintPcPres();
void	PrintEpim();
void	ExtPcPres();
void	ElimGenerators();
void	OutputMatrix( char * suffix );
void	Consistency();
void	Tails();
void	AddGenerators();
void	initPcPres();
void	ElimEpim();
void	evalTrMetAbRel( word * ul );
void	initPcPres();
void	EvalTrMetAb();
void	EvalAllRelations();
void	InitEpim();
void	InitPrint();
void	InitTrMetAb();
void	Presentation( FILE * fp, char * filename );
void	InitPcPres();
void	SetTimeOut( int nsec );
void	CatchSignals();

int	Debug = 0;
int	Gap = 0;
int	AbelianInv = 0;
int	NilpMult;
int	Verbose = 0;

char *	InputFile;

extern	int	RawMatOutput;

static	char	*ProgramName;
static	char	HostName[256] = "host name unknown";
static	int	Cl;

static
void	usage( char * error )
{
   int i;

   if ( error != (char *)0 ) 
      fprintf( stderr, "%s\n", error );
   fprintf( stderr, "usage: %s", ProgramName );
   fprintf( stderr, " [-a] [-M] [-d] [-g] [-v] [-s] [-f] [-c] [-m]\n" );
   for ( i = strlen(ProgramName)+7; i > 0; i-- ) 
      fputc( ' ', stderr );
   fprintf( stderr, " [-t <n>] [-l <n>] [-r <n>] [-n <n>] [-e <n>]\n" );
   for ( i = strlen(ProgramName)+7; i > 0; i-- ) 
      fputc( ' ', stderr );
   fprintf( stderr, 
            " [-y] [-o] [-p] [-E] [<presentation>] [<class>]\n" );
   exit( 1 );
}

static	int	leftEngel = 0,
		rightEngel = 0,
		revEngel = 0,
		engel = 0,
		nrEngelGens = 1;

static	int	trmetab = 0;

static
char	*Ordinal( int n ) 
{  
   switch( n ) {
      case 1:    return "st";
      case 2:    return "nd";
      case 3:    return "rd";
      default:   return "th";
   }
}

static
void	printHeader() 
{  
   printf( "#\n" );
   printf( "#    The ANU Nilpotent Quotient Program (Version %s)\n",
           VERSION );
   printf( "#    Calculating a nilpotent quotient\n" );
   printf( "#    Input: %s", InputFile );
   if ( leftEngel ) {
      if ( nrEngelGens > 1 )
         printf( " & the first %d generators are", nrEngelGens );
      else
         printf( " &" );
      printf( " %d%s left Engel", leftEngel, Ordinal( leftEngel ) );
   }
   if ( rightEngel ) {
      if ( nrEngelGens > 1 )
         printf( " & the first %d generators are", nrEngelGens );
      else
         printf( " &" );
      printf( " %d%s right Engel", rightEngel, Ordinal( rightEngel ) );
   }
   if ( engel )
      printf( " %d%s Engel", engel, Ordinal( engel ) );
   printf( "\n" );
   if ( Cl != 666 ) 
      printf( "#    Nilpotency class: %d\n", Cl );
   printf( "#    Program: %s", ProgramName );
   printf( "     Machine: %s\n", &(HostName[0]) );
   printf( "#    Size of exponents: %d bytes\n#\n", sizeof(exp) );
}

int	main( int argc, char * argv[] )
{  
   FILE *fp = NULL;
   long t, time, start, begin, printEpim = 1;
   gen g;
   extern word Epimorphism();
   CatchSignals();
   start = (long int) sbrk(0);
   begin = RunTime();
   ProgramName = argv[0]; //argc--; argv++;

#ifdef HAVE_GETHOSTNAME        
   gethostname( &(HostName[0]), 256 );
#endif

/*   setbuf( stdout, NULL ); REMOVED VIA VALGRIND */

   int opt;
   opterr = 0;
   while ( ( opt = getopt( argc, argv, "r:l:n:e:t:pgaMvdscfomyECS" ) ) != -1 ) {
      switch(opt) {
         case 'r' :
            if ( ( rightEngel = atoi(optarg) ) <= 0 ) {
               fprintf( stderr, "%s\n", optarg );
               usage( "<n> must be positive." );
            }
            break;
         case 'l' :
            if ( ( leftEngel = atoi(optarg) ) <= 0 ) {
               fprintf( stderr, "%s\n", optarg );
               usage( "<n> must be positive." );
            }
            break;
         case 'n' :
            if ( ( nrEngelGens = atoi(optarg) ) <= 0 ) {
               fprintf( stderr, "%s\n", optarg );
               usage( "<n> must be positive." );
            }
            break;
         case 'e' :
            if ( ( engel = atoi(optarg) ) <= 0 ) {
               fprintf( stderr, "%s\n", optarg );
               usage( "<n> must be positive." );
            }
            break;
         case 't' :
            if ( ( t = atoi(optarg) ) <= 0 ) {
               fprintf( stderr, "%s\n", optarg );
               usage( "<n> must be positive." );
            }
            switch( optarg[strlen(optarg)-1] ) {
               case 'd' : t *= 24 * 60 * 60; break;
               case 'h' : t *= 60 * 60; break;
               case 'm' : t *= 60; break;
            }
            SetTimeOut( t );
            break;
         case 'p': printEpim = !printEpim;			break;
         case 'g': Gap = !Gap; 					break;
         case 'a': AbelianInv = !AbelianInv; 			break;
         case 'M': NilpMult = !NilpMult; 			break;
         case 'v': Verbose = !Verbose; 				break;
         case 'd': Debug = !Debug; 				break;
         case 's': SemigroupOnly = !SemigroupOnly; 		break;
         case 'c': CheckFewInstances = !CheckFewInstances; 	break;
         case 'f': SemigroupFirst = !SemigroupFirst; 		break;
         case 'o': ReverseOrder = !ReverseOrder; 		break;
         case 'm': RawMatOutput = !RawMatOutput; 		break;
         case 'y': trmetab = 1;					break;
         case 'E': revEngel = !revEngel;			break;
         case 'C': UseCombiCollector = !UseCombiCollector;	break;
         case 'S': UseSimpleCollector = !UseSimpleCollector;	break;
         default : 
            fprintf( stderr, "unknown option: -%c\n", optopt );
            usage( (char *)0 );
            break;       
      }
   }

/*
   while ( argc > 0 && argv[0][0] == '-' ) {
      if ( argv[0][2] != '\0' ) {
         fprintf( stderr, "unknown option: %s\n", argv[0] );
         usage( (char *)0 );
      }
      switch( argv[0][1] ) {
         case 'h': usage( (char *)0 ); 
                   break;
         case 'r': if ( --argc < 1 ) 
                      usage("-r requires an argument");
                   argv++;
                   if ( (rightEngel = atoi(argv[0])) <= 0 ) {
                      fprintf( stderr, "%s\n", argv[0] );
                      usage( "<n> must be positive." );
                   }
                   break;
         case 'l': if ( --argc < 1 ) 
                      usage("-l requires an argument.");
                   argv++;
                   if ( (leftEngel = atoi(argv[0])) <= 0 ) {
                      fprintf( stderr, "%s\n", argv[0] );
                      usage( "<n> must be positive." );
                   }
                   break;
         case 'n': if ( --argc < 1 ) 
                      usage("-n requires an argument.");
                   argv++;
                   if ( (nrEngelGens = atoi(argv[0])) <= 0 ) {
                      fprintf( stderr, "%s\n", argv[0] );
                      usage( "<n> must be positive." );
                   }
                   break;
         case 'e': if ( --argc < 1 ) 
                      usage("-e requires an argument");
                   argv++;
                   if ( (engel = atoi(argv[0])) <= 0 ) {
                      fprintf( stderr, "%s\n", argv[0] );
                      usage( "<n> must be positive." );
                   }
                   break;
         case 't': if ( --argc < 1 ) 
                      usage("-t requires an argument");
                   argv++;
                   if ( (t = atoi(argv[0])) <= 0 ) {
                      fprintf( stderr, "%s\n", argv[0] );
                      usage( "<n> must be positive." );
                   }
                   switch( argv[0][strlen(argv[0])-1] ) {
                      case 'd' : t *= 24; break;
                      case 'h' : t *= 60; break;
                      case 'm' : t *= 60; break;
                   }
                   SetTimeOut( t );
                   break;
         case 'p': printEpim = !printEpim;			break;
         case 'g': Gap = !Gap; 					break;
         case 'a': AbelianInv = !AbelianInv; 			break;
         case 'M': NilpMult = !NilpMult; 			break;
         case 'v': Verbose = !Verbose; 				break;
         case 'd': Debug = !Debug; 				break;
         case 's': SemigroupOnly = !SemigroupOnly; 		break;
         case 'c': CheckFewInstances = !CheckFewInstances; 	break;
         case 'f': SemigroupFirst = !SemigroupFirst; 		break;
         case 'o': ReverseOrder = !ReverseOrder; 		break;
         case 'm': RawMatOutput = !RawMatOutput; 		break;
         case 'y': trmetab = 1;					break;
         case 'E': revEngel = !revEngel;			break;
         case 'C': UseCombiCollector = !UseCombiCollector;	break;
         case 'S': UseSimpleCollector = !UseSimpleCollector;	break;
         default : fprintf( stderr, "unknown option: %s\n", argv[0] );
                   usage( (char *)0 );
                   break;
      }
      argc--; argv++;
   }
*/

   /*
   ** The default is to read from stdin and have no (almost no)
   ** class bound.
   */
   InputFile = "<stdin>";
   Cl = 666;

   int index;
   for (index = optind; index < argc; index++) {
      if (!isdigit(argv[index][0]))
         InputFile = argv[index];
      else
         Cl = atoi(argv[index]);
   }


//   /* Parse the remaining arguments. */*
//   switch( argc ) {
//      case 0: break;
//      case 1: if ( !isdigit(argv[0][0]) )
//                 /* The only argument left is a file name. */
//                 InputFile = argv[0];
//              else 
//                 /* The only argument left is the class.   */
//                 Cl = atoi( argv[0] );
//              break;
//      case 2: /* Two arguments left. */
//              InputFile = argv[0];
//              Cl = atoi( argv[1] );
//              break;
//      default: usage( (char *)0 ); break;
//   }

   if ( Cl <= 0 ) 
      usage( "<class> must be positive." );



   /* Open the input stream. */
   if ( strcmp( InputFile, "<stdin>" ) == 0 )
      fp = stdin;
   else {
      if ( (fp = fopen( InputFile, "r" )) == NULL ) {
         perror( InputFile );
         exit( 1 );
      }
   }

   /* Read in the finite presentation. */
   Presentation( fp, InputFile );
   /* Set the number of generators. */
   WordInit( Epimorphism );
   InitEngel( leftEngel, rightEngel, revEngel, engel, nrEngelGens );
   InitTrMetAb( trmetab );
   InitPrint( stdout );

   printHeader();

   time = RunTime();

   if ( Gap ) 
      printf( "NqLowerCentralFactors := [\n" );

   if ( Gap & Verbose ) 
      fprintf( stderr, "#I  Class 1:" );

   printf( "#    Calculating the abelian quotient ...\n" );
   InitEpim();

   EvalAllRelations();
   EvalEngel();
   EvalTrMetAb();

   ElimEpim();

   if ( NrCenGens == 0 ) {
      printf( "#    trivial abelian quotient\n" );
      goto end;
   }

   /* if ( Cl == 1 ) goto end; */

   InitPcPres();

   if ( Gap & Verbose ) {
      fprintf( stderr, " %d generators with relative orders ", 
               Dimension[Class] ); 
      for ( g = NrPcGens-Dimension[Class]+1; g <= NrPcGens; g++ )
         fprintf( stderr, " %d", (int)(Exponent[g]) );
      fprintf( stderr, "\n" );
   }

   printf( "#    The abelian quotient" );
   printf( " has %d generators\n", Dimension[Class] );
   printf( "#        with the following exponents:" );
   for ( g = NrPcGens-Dimension[Class]+1; g <= NrPcGens; g++ )
      printf( " %d", (int)(Exponent[g]) );
   printf( "\n" );
   if (Verbose) {
      printf( "#    runtime       : %ld msec\n",RunTime()-time);
      printf( "#    total runtime : %ld msec\n",RunTime()-begin);
      printf( "#    total size    : %ld byte\n",(long int) sbrk(0)-start);
   }
   printf( "#\n" );

   while ( Class < Cl ) {
      time = RunTime();
      if ( Gap & Verbose )
         fprintf( stderr, "#I  Class %d:", Class+1 );
      printf( "#    Calculating the class %d quotient ...\n", Class+1 );

      AddGenerators();
      Tails();
      Consistency();

      if ( NilpMult ) 
         OutputMatrix( "nilp" );

      EvalAllRelations();
      EvalEngel();
      EvalTrMetAb();

      if ( NilpMult ) 
         OutputMatrix( "mult" );

      ElimGenerators();
      if ( NrCenGens == 0 ) 
         goto end;
      ExtPcPres();

      if ( Gap & Verbose ) {
         fprintf( stderr, " %d generators", Dimension[Class] );
         fprintf( stderr, " with relative orders:" );
         for ( g = NrPcGens-Dimension[Class]+1; g <= NrPcGens; g++ )
            fprintf( stderr, " %d", (int)(Exponent[g]) );
         fprintf( stderr, "\n" );
      }
      printf( "#    Layer %d of the lower central series", Class );
      printf( " has %d generators\n", Dimension[Class] );
      printf( "#          with the following exponents:" );
      for ( g = NrPcGens-Dimension[Class]+1; g <= NrPcGens; g++ )
         printf( " %d", (int)(Exponent[g]) );
      printf( "\n" );
      if (Verbose) {
         printf("#    runtime       : %ld msec\n",RunTime()-time);
         printf("#    total runtime : %ld msec\n",RunTime()-begin);
         printf("#    total size    : %ld byte\n",
                (long int) sbrk(0)-start);
      }
      printf( "#\n" );
   }

   end:
   TimeOutOff();
        
   if ( printEpim ) {
      printf( "\n\n#    The epimorphism :\n");
      PrintEpim();
      printf( "\n\n#    The nilpotent quotient :\n");
      PrintPcPres();
      printf( "\n\n#    The definitions:\n" );
      PrintDefs();
   }
   printf( "#    total runtime : %ld msec\n", 
           RunTime() - begin );
   printf( "#    total size    : %ld byte\n", 
           (long int) sbrk(0) - start );

   if ( Gap ) 
      printf( "];\n" );

   if ( Gap ) 
      PrintRawGapPcPres();

   if ( Gap & Verbose )
      fprintf( stderr, "\n" );

   TimeOutOn();

   PrintCollectionTimes();

   return 0;
}


/*************************************************************************
** $Log: nq.c,v $
** Revision 1.11  2008-11-18 16:26:03  bg41
** Style changes -bkg
**
** Revision 1.10  2008-11-04 15:52:26  bg41
** Style changes -bkg
**
** Revision 1.9  2008-10-30 14:45:08  bg41
** I removed unistd.h includes because it is not defined in ANSI C -bkg
**
** Revision 1.8  2008-10-23 15:21:22  bg41
** I made some more style changes -bkg
**
** Revision 1.7  2008-10-23 15:15:39  bg41
** cleaned up the code style & converted the old
** function declarations to the normal  -bkg
**
** Revision 1.6  2008-09-30 18:26:53  bg41
** cleaned up -Wall errors -bkg
**
** Revision 1.5  2008-09-26 18:10:06  bg41
** added another prototype CatchSignals() -bkg
**
** Revision 1.4  2008-09-26 18:02:00  bg41
** added a bunch of prototypes and a couple #includes -bkg
**
** Revision 1.3  2008-09-25 19:37:37  bg41
** added an include to fix a compiler warning -bkg
**
** Revision 1.2  2008-09-25 19:29:05  bg41
** modified header & added footer -bkg
*/
