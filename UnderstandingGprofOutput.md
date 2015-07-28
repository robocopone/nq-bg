

# How to Understand the Flat Profile #

The flat profile shows the total amount of time your program spent executing each function.
```
Flat profile:

Each sample counts as 0.01 seconds.
  %   cumulative   self              self     total           
 time   seconds   seconds    calls  ms/call  ms/call  name    
 33.34      0.02     0.02     7208     0.00     0.00  open
 16.67      0.03     0.01      244     0.04     0.12  offtime
 16.67      0.04     0.01        8     1.25     1.25  memccpy
 16.67      0.05     0.01        7     1.43     1.43  write
 16.67      0.06     0.01                             mcount
  0.00      0.06     0.00      236     0.00     0.00  tzset
  0.00      0.06     0.00      192     0.00     0.00  tolower
  0.00      0.06     0.00       47     0.00     0.00  strlen
  0.00      0.06     0.00       45     0.00     0.00  strchr
  0.00      0.06     0.00        1     0.00    50.00  main
  0.00      0.06     0.00        1     0.00     0.00  memcpy
  0.00      0.06     0.00        1     0.00    10.11  print
  0.00      0.06     0.00        1     0.00     0.00  profil
  0.00      0.06     0.00        1     0.00    50.00  report
...
```

  * % time
    * This is the percentage of the total execution time your program spent in this function. These should all add up to 100%.
  * cumulative seconds
    * This is the cumulative total number of seconds the computer spent executing this functions, plus the time spent in all the functions above this one in this table.
  * self seconds
    * This is the number of seconds accounted for by this function alone. The flat profile listing is sorted first by this number.
  * calls
    * This is the total number of times the function was called. If the function was never called, or the number of times it was called cannot be determined (probably because the function was not compiled with profiling enabled), the calls field is blank.
  * self ms/call
    * This represents the average number of milliseconds spent in this function per call, if this function is profiled. Otherwise, this field is blank for this function.
  * total ms/call
    * This represents the average number of milliseconds spent in this function and its descendants per call, if this function is profiled. Otherwise, this field is blank for this function.
  * name
    * This is the name of the function. The flat profile is sorted by this field alphabetically after the self seconds field is sorted.

# How to Read the Call Graph #

The call graph shows how much time was spent in each function and its children. From this information, you can find functions that, while they themselves may not have used much time, called other functions that did use unusual amounts of time.

Here is a sample call from a small program. This call came from the same gprof run as the [flat profile](http://code.google.com/p/nq-bg/wiki/UnderstandingGprofOutput#flatprofile) example above.
```
granularity: each sample hit covers 2 byte(s) for 20.00% of 0.05 seconds

index % time    self  children    called     name
                                                 <spontaneous>
[1]    100.0    0.00    0.05                 start [1]
                0.00    0.05       1/1           main [2]
                0.00    0.00       1/2           on_exit [28]
                0.00    0.00       1/1           exit [59]
-----------------------------------------------
                0.00    0.05       1/1           start [1]
[2]    100.0    0.00    0.05       1         main [2]
                0.00    0.05       1/1           report [3]
-----------------------------------------------
                0.00    0.05       1/1           main [2]
[3]    100.0    0.00    0.05       1         report [3]
                0.00    0.03       8/8           timelocal [6]
                0.00    0.01       1/1           print [9]
                0.00    0.01       9/9           fgets [12]
                0.00    0.00      12/34          strncmp <cycle 1> [40]
                0.00    0.00       8/8           lookup [20]
                0.00    0.00       1/1           fopen [21]
                0.00    0.00       8/8           chewtime [24]
                0.00    0.00       8/16          skipspace [44]
-----------------------------------------------
[4]     59.8    0.01        0.02       8+472     <cycle 2 as a whole>	[4]
                0.01        0.02     244+260         offtime <cycle 2> [7]
                0.00        0.00     236+1           tzset <cycle 2> [26]
-----------------------------------------------
```
The lines full of dashes divide this table into entries, one for each function. Each entry has one or more lines.

In each entry, the primary line is the one that starts with an index number in square brackets. The end of this line says which function the entry is for. The preceding lines in the entry describe the callers of this function and the following lines describe its subroutines (also called children when we speak of the call graph).

The entries are sorted by time spent in the function and its subroutines.

## The Primary Line ##

The primary line in a call graph entry is the line that describes the function which the entry is about and gives the overall statistics for this function.

For reference, we repeat the primary line from the entry for function report in our main example, together with the heading line that shows the names of the fields:
```
index  % time    self  children called     name
...
[3]    100.0    0.00    0.05       1         report [3]
```
Here is what the fields in the primary line mean:

  * index
    * Entries are numbered with consecutive integers. Each function therefore has an index number, which appears at the beginning of its primary line.
    * Each cross-reference to a function, as a caller or subroutine of another, gives its index number as well as its name. The index number guides you if you wish to look for the entry for that function.
  * % time
    * This is the percentage of the total time that was spent in this function, including time spent in subroutines called from this function.
    * The time spent in this function is counted again for the callers of this function. Therefore, adding up these percentages is meaningless.
  * self
    * This is the total amount of time spent in this function. This should be identical to the number printed in the seconds field for this function in the flat profile.
  * children
    * This is the total amount of time spent in the subroutine calls made by this function. This should be equal to the sum of all the self and children entries of the children listed directly below this function.
  * called
    * This is the number of times the function was called.
    * If the function called itself recursively, there are two numbers, separated by a `+'. The first number counts non-recursive calls, and the second counts recursive calls.
    * In the example above, the function report was called once from main.
  * name
    * This is the name of the current function. The index number is repeated after it.

If the function is part of a cycle of recursion, the cycle number is printed between the function's name and the index number (see section How Mutually Recursive Functions Are Described). For example, if function gnurr is part of cycle number one, and has index number twelve, its primary line would be end like this:

gnurr <cycle 1> `[12]`

## Lines for a Function's Callers ##

A function's entry has a line for each function it was called by. These lines' fields correspond to the fields of the primary line, but their meanings are different because of the difference in context.

For reference, we repeat two lines from the entry for the function report, the primary line and one caller-line preceding it, together with the heading line that shows the names of the fields:
```
index  % time    self  children called     name
...
                0.00    0.05       1/1           main [2]
[3]    100.0    0.00    0.05       1         report [3]
```
Here are the meanings of the fields in the caller-line for report called from main:

  * self
    * An estimate of the amount of time spent in report itself when it was called from main.
  * children
    * An estimate of the amount of time spent in subroutines of report when report was called from main.
    * The sum of the self and children fields is an estimate of the amount of time spent within calls to report from main.
  * called
    * Two numbers: the number of times report was called from main, followed by the total number of nonrecursive calls to report from all its callers.
  * name and index number
    * The name of the caller of report to which this line applies, followed by the caller's index number.
    * Not all functions have entries in the call graph; some options to gprof request the omission of certain functions. When a caller has no entry of its own, it still has caller-lines in the entries of the functions it calls.
    * If the caller is part of a recursion cycle, the cycle number is printed between the name and the index number.

If the identity of the callers of a function cannot be determined, a dummy caller-line is printed which has `'<spontaneous>'` as the "caller's name" and all other fields blank. This can happen for signal handlers.

## Lines for a Function's Subroutines ##

A function's entry has a line for each of its subroutines--in other words, a line for each other function that it called. These lines' fields correspond to the fields of the primary line, but their meanings are different because of the difference in context.

For reference, we repeat two lines from the entry for the function main, the primary line and a line for a subroutine, together with the heading line that shows the names of the fields:
```
index  % time    self  children called     name
...
[2]    100.0    0.00    0.05       1         main [2]
                0.00    0.05       1/1           report [3]
```
Here are the meanings of the fields in the subroutine-line for main calling report:

  * self
    * An estimate of the amount of time spent directly within report when report was called from main.
  * children
    * An estimate of the amount of time spent in subroutines of report when report was called from main.
    * The sum of the self and children fields is an estimate of the total time spent in calls to report from main.
  * called
    * Two numbers, the number of calls to report from main followed by the total number of nonrecursive calls to report.
  * name
    * The name of the subroutine of main to which this line applies, followed by the subroutine's index number.
    * If the caller is part of a recursion cycle, the cycle number is printed between the name and the index number.