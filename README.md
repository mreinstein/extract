# extract

a command line tool to extract a sub rectangle from a series of image frames


you can pass `-x`, `-y`, `--width`, and `--height` options to specify an exact rectangle, or omit these
options to determine the maximum bounding rectangle that includes non-transparent pixels.

The input files must be prefixed with `in_` and have continuous numbers from 0 to `length - 1`
The output file will be placed in the same directory and be prefixed with `out_`.

## usage examples

### manual bounds

given `in_00.png`, `in_01.png`, `in_02.png`, `in_03.png` within `/path/to/input/directory`:

```bash
extract --input /path/to/input/directory  --x 10 --y 10 --width 100 --height 50 --length 4
```

## automatic bounds

given `in_00.png`, `in_01.png`, `in_02.png`, `in_03.png` within `/path/to/input/directory`:

```bash
extract --input /path/to/input/directory  --length 4
```

Will analyze each input image, determine the bounding box of non-transparent pixels, merge all of the bounding boxes into one and
generate the output files.
