function makePost(infixexpr) {
	prec = {}
	prec["*"] = 4
	prec["/"] = 4
	prec["+"] = 3
	prec["~"] = 3
	prec[">"] = 2
	prec["<"] = 2
	prec["="] = 2
	prec["!"] = 2
	prec["["] = 2
	prec["]"] = 2
	prec["&"] = 1
	prec["|"] = 0
	prec["("] = -1
	opStack = []
	postfixList = []
	intstr = ''
	expstr = ''
	tokenList = []
	temptoken = ''
	for ie in infixexpr:
		if ie in "-0123456789":
			temptoken += ie
		else:
			if temptoken != '':
				tokenList.append(temptoken)
			tokenList.append(ie)
			temptoken = ''
	if temptoken != '':
		tokenList.append(temptoken)
	#tokenList = infixexpr.split()
	#print(tokenList)
	for token in tokenList:
		if token not in ['*','/','+','~','>','<','=','!','[',']','&','|','(',')']:
			postfixList.append(token)
		elif token == '(':
			opStack.append(token)
		elif token == ')':
			topToken = opStack.pop()
			while topToken != '(':
				postfixList.append(topToken)
				topToken = opStack.pop()
		else:
			while (len(opStack) > 0) and (prec[opStack[-1]] >= prec[token]):
				postfixList.append(opStack.pop())
			opStack.append(token)

	while len(opStack) > 0:
		postfixList.append(opStack.pop())
	for ci in postfixList:
		if ci not in ['+','~','*','/','>','<','&','|','=','!','[',']']:
			intstr += ci + '_'
			expstr += '#'
		elif ci == '~':
			expstr += '-'
		else:
			expstr += ci
	
	intstr = intstr[:-1]
	return [intstr,expstr]

}

function replaceDecimals(istr){
	dindex = istr.find('.')
	while dindex >-1:
		intpart = 0
		decpart = 0
		denom = 1
		strparts = [dindex,dindex+1]
		for i in range(1,dindex+1):
			if istr[dindex-i] in "0123456789":
				intpart += int(istr[dindex-i])*10**(i-1)
				strparts[0] = dindex-i
			else:
				break
		for i in range(dindex+1,len(istr)):
			if istr[i] in "0123456789":
				decpart *=10
				denom *=10
				decpart += int(istr[i])	
				strparts[1] = i+1
			else:
				break
		istr = istr[:strparts[0]]+'('+str(intpart*denom+decpart)+'/'+str(denom)+')'+istr[strparts[1]:]
		dindex = istr.find('.')
				

	return istr
}

function replaceNegatives(istr){
	dindex = istr.indexOf('-')
	while (dindex >-1){
		if (dindex == 0){
			if ("0123456789".indexOf(istr[1]) == -1) {
				istr = '-1*'+istr.substring(1,);
			}
			dindex = istr.indexOf('-',1);
		}
		else{
			if (istr[dindex-1] in ['>','<','=','!','[',']','&','|','(']) {
				if istr[dindex+1] not in "0123456789":
					istr = istr[:dindex]+'-1*'+istr[dindex+1:]
				dindex = istr.find('-',dindex+1)
			}
			else{
				istr = istr[:dindex]+'~'+istr[dindex+1:]
				dindex = istr.find('-',dindex+1)
			}
		}
	}
				
	return istr
}

function postfixify(input_str) {
	var output_str = replaceNegatives(input_str);
	return output_str;
}