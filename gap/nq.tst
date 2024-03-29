#############################################################################
##
#A    nq.tst                   August 2002                      Werner Nickel
##

## set the size of the screen to a known value ##############################
sizeScreen := SizeScreen();;
SizeScreen( [ 70, 24 ] );;

G := FreeGroup( 2 );;
NilpotentQuotient( G, 10 );
#>[ [ 0, 0 ], [ 0 ], [ 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]

G := FreeGroup( 3 );;
NilpotentQuotient( G, 7 );
#>[ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
#>  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
#>      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]

NilpotentQuotient( "../examples/G1.14", 13 );
#>[ [ 0, 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0, 0 ], [ 0 ], [ 0, 0 ], 
#>  [ 10, 0 ], [ 10, 30, 0 ], [ 2, 10, 30, 0 ], 
#>  [ 2, 10, 10, 30, 0, 0 ], [ 2, 2, 10, 10, 30, 0 ], 
#>  [ 2, 10, 10, 10, 10, 200, 0 ] ]

G := FreeGroup( 2 );;
G := G / [ LeftNormedComm([ G.2, G.1, G.1 ]),
           LeftNormedComm([ G.1, G.2, G.2, G.2, G.2 ]) ];;
NilpotentQuotient( G );
#>[ [ 0, 0 ], [ 0 ], [ 0 ], [ 0 ], [ 0 ], [ 2 ], [ 2, 2 ], [ 2, 2 ], 
#>  [ 2, 2 ], [ 2 ] ]

G := FreeGroup( 3 );;
G := G / [ LeftNormedComm([ G.2, G.1, G.1 ]),
           LeftNormedComm([ G.1, G.2, G.2 ]),
           LeftNormedComm([ G.3, G.1 ]),
           LeftNormedComm([ G.3, G.2, G.2 ]),
           LeftNormedComm([ G.2, G.3, G.3 ]) ];; 
NilpotentQuotient( G, 15 );
#>[ [ 0, 0, 0 ], [ 0, 0 ], [ 0 ], [ 2 ], [ 2, 2 ], [ 2 ], [ 2 ], 
#>  [ 2 ], [ 2 ], [ 2 ], [ 2 ], [ 2 ], [ 2 ], [ 2 ], [ 2 ] ]

NilpotentQuotient( "../examples/G4.8", 8 );
#>[ [ 0, 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ], 
#>  [ 6, 0, 0 ], [ 6, 6, 6, 0 ], [ 2, 6, 6, 6, 6, 6 ], 
#>  [ 2, 2, 6, 6, 6, 6, 6, 6 ] ]

NilpotentQuotient( "../examples/G5.10", 10 );
#>[ [ 0, 0, 0 ], [ 0, 0 ], [ 0, 0, 0 ], [ 0, 0 ], [ 3, 0, 0 ], 
#>  [ 3, 3, 0, 0 ], [ 3, 3, 6, 6, 0, 0 ], [ 3, 6, 6, 6, 18, 0 ], 
#>  [ 3, 3, 3, 3, 3, 3, 6, 90, 0 ], 
#>  [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 18, 90 ] ]

## add timings for the GAP part of the nq-stuff              ##############
SizeScreen(sizeScreen);;
Print("nq               Aug 2002  ",QuoInt(200000000,time)," GAPstones\n");
if IsBound( GAPSTONES )  then Add( GAPSTONES, QuoInt(200000000,time) );  fi;
