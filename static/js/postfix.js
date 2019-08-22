/*
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
*/
function replaceDecimals(istr){
	dindex = istr.indexOf('.');
	while (dindex >-1){
		intpart = 0;
		decpart = 0;
		denom = 1;
		console.log(istr,intpart,denom,decpart);
		strparts = [dindex,dindex+1];
		for (var i=1;i<dindex+1;i++){
			if ("0123456789".indexOf(istr[dindex-1]) > -1){
				intpart += parseInt(istr[dindex-i])*Math.pow(10,i-1);
				strparts[0] = dindex-i;
			}
			else{break;}
		}
		for (var i=dindex+1;i<istr.length;i++){
			if ("0123456789".indexOf(istr[i]) > -1){
				decpart *=10;
				denom *=10;
				decpart += parseInt(istr[i]);
				strparts[1] = i+1;
			}
			else{break;}
		}
		console.log(istr,intpart,denom,decpart);
		istr = istr.substring(0,strparts[0])+'('+ (intpart*denom+decpart) +'/'+ denom +')'+istr.substring(strparts[1],);
		dindex = istr.indexOf('.');
	}

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
			if ("><=![]&|(".indexOf(istr[dindex-1])> -1) {
				if ("0123456789".indexOf(istr[dindex-1])== -1){
					istr = istr.substring(0,dindex)+'-1*'+istr.substring(dindex+1,);
				}
				dindex = istr.indexOf('-',dindex+1);
			}
			else{
				istr = istr.substring(0,dindex)+'~'+istr.substring(dindex+1,);
				dindex = istr.indexOf('-',dindex+1);
			}
		}
	}
				
	return istr
}

function postfixify(input_str) {
	input_str = input_str.toUpperCase();
	//Convert column names
	input_str = input_str.replace(/AND/g,'&');
	input_str = input_str.replace(/OR/g,'|');
	input_str = input_str.replace(/\[/g,'(');
	input_str = input_str.replace(/]/g,')');
	input_str = input_str.replace(/{/g,'(');
	input_str = input_str.replace(/}/g,')');
	input_str = input_str.replace(/>=/g,']');
	input_str = input_str.replace(/<=/g,'[');
	input_str = input_str.replace(/==/g,'=');
	input_str = input_str.replace(/!=/g,'!');
	input_str = input_str.replace(/\+-/g,'-');
	input_str = input_str.replace(/--/g,'+');
	input_str = replaceDecimals(input_str);
	var output_str = replaceNegatives(input_str);
	return output_str;
}

//12.3-4.5==-2+aAND4.552!=(x-1)