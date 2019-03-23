## snapshots a file
dir/1.md

/* expected */
# dir/1.md

dir-1.md
/**/

## snapshots a directory
.

/* expected */
# dir/1.md

dir-1.md

# dir/2.md

dir-2.md

# dir/dir2/1.txt

dir2-1.txt
/**/

## snapshots an inner directory
dir

/* expected */
# 1.md

dir-1.md

# 2.md

dir-2.md

# dir2/1.txt

dir2-1.txt
/**/