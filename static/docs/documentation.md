# Create
The create command creates the table. Call this one time (generally as soon as the websocket connection is opened). No data will appear until this command is called.

# Load
The load command places the entire table into memory to allow for analysis. Call this one time. Do it before any real analysis is needed.



# Display Columns
The display command tells the server which columns to return and in which order. If you want to handle column deletion or movement on the frontend you can, but if you prefer the server to return the exact columns you want already arranged this command is helpful.

The JSON object should be of the form: {'command':'display', 'column':'{{COLUMN_TO_MOVE}}', 'location':'{{NEW_COLUMN_AFTER}}'}

{{COLUMN_TO_MOVE}} is the id of the column that is moving. This id comes from the server and never changes even if columns move. The id is an integer but can be sent either as an integer or string.

{{NEW_COLUMN_AFTER}} is the id of the column that will be come after the moving column. This id comes from the server and never changes even if columns move. The id is an integer but can be sent either as an integer or string. If the column is to be removed, use ??. If the column is to be the last column, use ??.

# Print
The print command simply prints a section of the table. 

The JSON object should be of the form: {'command':'print', 'startrow':'{{STARTROW}}', 'endrow':'{{ENDROW}}', 'type':'{{PRINTTYPE}}'}

{{PRINTTYPE}} can be main or pivot. You only need to include this if you are switching to or back from a pivot. Without this option, the current type will be used.

{{STARTROW}} is the first row to print and {{ENDROW}} is one more than the last row to print. So {'command':'print', 'startrow':0, 'endrow':10} prints the first 10 rows and {'command':'print', 'startrow':100, 'endrow':200} prints 100 rows from 100 to 199.

Not including a startrow or endrow will print using old values for both.



# Pivot
The pivot command creates a pivot table.

The JSON object should be of the form: {'command':'pivot', 'pivotcol':'{{PIVOTCOLUMN}}', 'sort':'{{SORTCOLUMN}}', 'columns':'[{{PIVOTCOLUMNS}}]'}

The pivot column must be the id of the column that forms the pivot.

The other columns determine what information is returned. By default, any column id that is included in the columns array will return the sum of that column for all rows in each pivot. Including 'sum(id)' does the exact same thing if desired. If you want other operations you can add 'max(id)', 'min(id)', 'first(id)', 'last(id)', 'mean(id)', or 'countif(id formula)' where first returns the first occurence in the array based on the current sort and last returns the last occurence. 

The 'countif(id)' returns the number of non-blank cells in that column. In addition, any formula can be included but columns should be identified as a lower case c followed by the id. Thus 'countif(c3+c4>0)' would count the number of rows for each pivot where the column with id=3 plus the column with id=4 is greater than 0. 

Pivot tables respect existing filters and will ignore any rows that are currently filtered out. So filtering by some column > 0 and then performing a countif(that column < 0) will return 0. If you want to pivot the entire table, you must clear the filter first.

The sort command tells the server how to sort the pivot table. Commands are the same as for the columns and in fact the sort command is optional as the first column of the columns array will be used if sort is not specified.

The pivot command only creates the table: a print command needs to follow to display the pivot table.

# Filter
The filter command

The JSON object should be of the form: {'command':'filter', 'formula':'{{FORMULA}}'}

Pivot tables are not currently filterable.

# Sort
The sort command

The JSON object should be of the form: {'command':'sort', 'column':'{{COLUMN_ID}}'}

Pivot tables are not currently directly sortable. You need to create a new Pivot table with the desired sort property.

# Add column
The addcol command

The JSON object should be of the form: {'command':'addcol', 'formula':'{{FORMULA}}'}

