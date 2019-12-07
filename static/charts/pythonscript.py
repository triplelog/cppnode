import sys
fread = open('static/newtest2-1.svg','r')
fwrite = open('static/test4.svg','w')

clipped = False
changed = False
for line in fread:
    if not clipped and line.find('clip-path') > -1:
    	clipped = True
    	fwrite.write(line)
    elif clipped and not changed and line.find('<path ') > -1:
    	bars = []
    	
    	mindex = line.find('M ')
    	zindex = line.find(' Z')
    	while mindex > -1 and zindex > mindex:
    		bars.append(line[mindex:zindex+2])
    		line = line[zindex+2:]
    		mindex = line.find('M ')
    		zindex = line.find(' Z')
    	changed = True
    	newline = ''
    	i = 0
    	for bar in bars:
    		newline += '<path id="bar-'+str(i)+'" onclick="barCLicked()" d="'+bar+'"/>'
    		i+=1
    	fwrite.write(newline)
    else:
    	fwrite.write(line)


fread.close()



fwrite.close()
