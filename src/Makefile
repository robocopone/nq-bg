##############################################################################
##
##    Makefile                      NQ-BG                      Bradley Graber
##
##    $Id: Makefile,v 1.5 2008-10-28 19:22:52 bg41 Exp $
##

##    GNU cc has the integer data type long long.  It can be used for
##    exponents of words by setting the variable LONGLONG to -DLONGLONG.

LONGLONG = -DLONGLONG

CC=gcc
#OPTS = -g -pg $(LONGLONG) $(COPTS)
OPTS = -O3 $(LONGLONG) $(COPTS)
CFLAGS = -O0 -g $(OPTS) -DVERSION='"2.0 January 2003"' -Wall
#CFLAGS = $(OPTS) -DVERSION='"2.0 January 2003"' -Wall

OBJ = consistency.o pc.o relations.o word.o system.o time.o \
      addgen.o tails.o eliminate.o engel.o glimt.o instances.o \
      presentation.o mem.o pcarith.o collect.o combicol.o trmetab.o gap.o

nq : nq.o $(OBJ)
	$(CC) $(CFLAGS) nq.o $(OBJ) -L$(GNU_MP_LIB) -o nq -lgmp

glimt.o: glimt.c
	$(CC) $(CFLAGS) -I$(GNU_MP_INC) -c glimt.c
clean :
	rm -f *.o nq *~

spotless : clean
	rm -f config.h

# $Log: Makefile,v $
# Revision 1.5  2008-10-28 19:22:52  bg41
# -Std=c99 & -Wall -bkg
#
# Revision 1.4  2008-10-02 13:36:56  bg41
# changed from Ansi '99 to Wall -bkg
#
# Revision 1.3  2008-09-26 13:39:29  bg41
# Added Ansi'99 checking to the compile -bkg
#
# Revision 1.2  2008-09-25 17:32:42  bg41
# updated the header -bkg
#
