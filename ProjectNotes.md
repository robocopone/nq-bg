### Mar 25, 2009 ###
  * [vSub](http://www.google.com/codesearch/p?hl=en#1psUwYYcK9c/trunk/src/glimt.c&q=vsub&exact_package=http://nq-bg.googlecode.com/svn&l=471) analasys.
    * vSub is the bottleneck function in G4 & G5.
    * This is not because the function takes a long time to execute, however.  The function takes essentially no time to execute, but is called 324 million times by the function lastReduce (Defined directly below vSub).  Any increase in efficency, therefore, would be achieved through reducing the amount of times lastReduce calls vSub.
    * lastReduce consists soley of the following code.
```
   for ( i = 0; i < NrRows; i++ )
       for ( j = i-1; j >= 0; j-- )
          vSub( Matrix[j], Matrix[i], Heads[i] );
```
  * [simpleCollect](http://www.google.com/codesearch/p?hl=en#1psUwYYcK9c/trunk/src/collect.c&q=simplecollect&exact_package=http://nq-bg.googlecode.com/svn&l=62) analasys
    * simpleCollect is the bottleneck function in G1 & G3, however it is more balanced in G3 (which probably explains why it could do a much higher class size than the others).  vSub plays a role in bogging the program down also, but not nearly as much as it does in G4 & G5.
    * simpleCollect is nearly the slowest function in the program in G1, but is also called 300k times.
    * simpleCollect is called exclusivly from Collect, which is defined directly below simpleCollect.  Collect is also called 300k times, and is called from multiple other subroutines.  Reducing the number of times the function is called would probably very arduous.  Focusing on increasing the speed of the function would probably be the best route to reducing this bottleneck.

### Mar 24, 2009 ###
  * I added the gprof information for the initial run.

### Mar 12, 2009 ###
  * I added the code to the SVN repository, and changed the $ID$ to $Rev$ because that is what SVN uses
  * $Log$ is not supported in SVN for [this reason](http://subversion.tigris.org/faq.html#log-in-source).  I have left the old CVS logs, however.
  * I reversed the chronology of this file to make it easier to update

### Feb 24, 2009 ###
  * I discovered Google's code site & decided to set up a project using it.

### Jan 26 2009 ###
  * I modified the options routine to use getopt.  I tested the output for a file using every argument against the output of the original, and it matched perfectly except for the time spent processing lines.  I originally did this to see if it would fix an error that valgrind is reporting, but it did not fix the error.  I would like to keep it because it offers more robust option processing & also fixed a bug that existed in the old code that was calculating the wait improperly for the -t option. For example, 1d was processed as 24 seconds	rather than 24 hours.  Getopt is not ansi C however, so I had to remove the -std=c99 option in order to use it.

### Nov 12 2008 ###
  * I am putting the opening braces for function definitions on their own lines because i think it looks the best.  I am beginning to think putting the opening braces for if/for/while statements on their own line as well because it looks better when the ( ) portion of the statement has to be broken into multiple lines.  Also when you are at the } end of the block of code, it is easier to see the beginning brace.
  * I am doing a 3 space indent because that is what I've always done.
  * I am not putting a space between a function and the opening (.  I am, however, putting a space after if/for/while because that is how I've always done it, and also because it differentiates them from functions.
  * I am limiting the width of the code to 74 characters on the recommendation of Dr. Morse.
  * Large comment blocks go as such, and are generally found before definitions and describe what the definition pertains to.
```
/**************************(fill to 74 characters)
** Comment
** comment
*/
```
  * Smaller comment blocks go as such, and are for comments within definitions
```
/*
** comment
** comment
*/
```
  * Smaller still, these comments are for short notes within code
```
/* comment */
```
  * In situations when a for does not require { } but the statement nested does I am added { } to the original for to err on the side of clarity.  For example:
```
for ( ; ; ) {
   if ( etc ) {
      etc;
      etc;
   }
}
```
  * Instead of
```
for ( ; ; )
   if ( etc ) {
      etc;
      etc;
   }
```

### Nov 5 2008 ###
  * The call to sbrk(0) is the only problem left to fix for ANSI compatibility.  I am converting all the code to a specific style now.

### Oct 30 2008 ###
  * If there is an ANSI compliant way to call sbrk(0) I can't find it...  I'm not sure why it is even necessary to report the size of memory used to compute.

### Oct 28 2008 ###
  * There are still a few problems with the C99 code standard.  Gethostname() is not supported, but is checked in the configure script.  The program also uses multi-threading which is not specified in C99.

### Oct 2 2008 ###
  * I installed GAP & considered some style changes for the project.

### Sept 30 2008 ###
  * I fixed the -Wall warnings.  It was mostly unused variables, uninitialized variables and mismatching data types in printf.

### Sept 26 2008 ###
  * ANSI '99 now has only 3 warnings.  $Id$ and $Log$ are on most source files.

### Sept 25 2008 ###
  * Added the $Id$ and $Log$ to some files.  A style format needs to be set.
  * Cleaned up the initial compiler errors.  All were caused by the lack of an #include, mostly <stdlib.h>
  * Compiled with ANSI '99 Standard & discovered a ton of work.

### Sept 23 2008 ###
  * The date was wrong on the supplied control test cases.  It was July 2002, and needed to be January 2003.

### Sept 18 2008 ###
  * CVS Repository approved.
  * Starting work on commenting and finding out why the test cases fail.

### Sept 16 2008 ###
  * Setup DNS on the server
  * Setup nq-2.2 as the starting point in the CVS repository

### Sept 9 2008 ###
  * Setup CVS & CVSD on the server
  * Setup the external IP 192.195.227.69 for the server