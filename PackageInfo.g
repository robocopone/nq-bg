#############################################################################
##  
##  PackageInfo.g                  NQ                           Werner Nickel
##  
##  Based on Frank L�beck's template for PackageInfo.g.
##  

SetPackageInfo( rec(

PackageName := "nq",
Subtitle := "Nilpotent Quotients of Finitely Presented Groups",
Version := "3dev",
Date    := "06/02/2007",

Persons := [
  rec(
  LastName      := "Nickel",
  FirstNames    := "Werner",
  IsAuthor      := true,
  IsMaintainer  := true,
  Email         := "nickel@mathematik.tu-darmstadt.de",
  WWWHome       := "http://www.mathematik.tu-darmstadt.de/~nickel",
  PostalAddress := Concatenation( "Fachbereich Mathematik, AG 2 \n",
                                  "TU Darmstadt\n",
                                  "Schlossgartenstr. 7\n",
                                  "64289 Darmstadt\n",
                                  "Germany" ),
  Place         := "Darmstadt, Germany",
  Institution   := "Fachbereich Mathematik, TU Darmstadt"
  )
],

Status         := "accepted",
CommunicatedBy := "Joachim Neub�ser (RWTH Aachen)",
AcceptDate     := "01/2003",

PackageWWWHome := 
        "http://www.mathematik.tu-darmstadt.de/~nickel/software/NQ/",

ArchiveFormats := ".tar.gz",
ArchiveURL     := Concatenation( ~.PackageWWWHome, "nq" ),
README_URL     := Concatenation( ~.PackageWWWHome, "README" ),
PackageInfoURL := Concatenation( ~.PackageWWWHome, "PackageInfo.g" ),

AbstractHTML   := Concatenation( 
               "This package provides access to the ANU nilpotent quotient ",
               "program for computing nilpotent factor groups of finitely ",
               "presented groups." ),

                  
PackageDoc := rec(
  BookName  := "nq",
  ArchiveURLSubset := [ "doc" ],
  HTMLStart := "doc/chap0.html",
  PDFFile   := "doc/manual.pdf",
  SixFile   := "doc/manual.six",
  LongTitle := "Nilpotent Quotient Algorithm",
  Autoload  := false
),

Dependencies := rec(
  GAP                    := ">= 4.2",
  NeededOtherPackages    := [ ["polycyclic", ">= 1.0"] ],
  SuggestedOtherPackages := [ ["GAPDoc", ">= 0.99"] ],
  ExternalConditions     := [ "needs a UNIX system with C-compiler",
                              "needs GNU multiple precision library" ]
),

AvailabilityTest := function()
    local   path;
    
    # test for existence of the compiled binary
    path := DirectoriesPackagePrograms( "nq" );

    if Filename( path, "nq" ) = fail then
        Info( InfoWarning, 1,
              "Package ``nq'': The executable program is not available" );
        return fail;
    fi;
    return true;
end,

Autoload := false,

Keywords := [ "nilpotent quotient algorithm",
              "nilpotent presentations",
              "finitely presented groups",
              "finite presentations   ",
              "commutators",
              "lower central series",
              "identical relations",
              "expression trees",
              "nilpotent Engel groups",
              "right and left Engel elements",
              "computational"
              ]
));


