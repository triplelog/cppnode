#include <algorithm>
#include <math.h>
#include <limits.h>
#include <string.h> 
#include <ctype.h>
#include <iostream>
#include <variant>
#include <map>
#include <numeric>
#include <chrono>
#include <thread>
#include <sstream>
#include <array>
#include <stdio.h>      /* printf, scanf, puts, NULL */
#include <stdlib.h>     /* srand, rand */
#include <time.h>       /* time */
#include <vector>
using namespace std::chrono;
unsigned int now; unsigned int start;



int main(int argc, char *argv[]) {
	
	start = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
	
	
	
	now = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
	printf("\n%d,%d,%d\n", now, argc ,now - start);
	
	
	
	now = std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
    printf("\n%d,%d\n", now,now - start);
	return 0;
}

extern "C" {


char* trim(char* x) {
	return x;
}


char* getType(char* x) {
	
	int i = 0; int ii; int iii; int qc; int qcc; int osl;
	char a[20];
	char b[20];
	bool chg = true;
	int d;
	int val;
	//Cppdata out = Cppdata(0);
	if (*x == '\0') {return "blank";}
	//Trim whitespace and remove unneeded parentheses
	while (*x){
		if (i == 0 && *x == ' '){}
		else if (i == 0 && *x == '\t'){}
		else {
			a[i] = *x;
			i++;
			if (*x == ' ' || *x == '\t'){
			}
			else {
				if (*x == '0' || *x == '1' || *x == '2' || *x == '3' || *x == '4' || *x == '5' || *x == '6' || *x == '7' || *x == '8' || *x == '9') {d++; val = val*10 + (*x - '0');}
				ii = i;
			}
		}
		x++;
	}
	
	if (ii == 0){return "blank";}
	else if (d == ii) {return "integer";}
	a[ii] = '\0';
	
	//Trim whitespace and quotation marks
	do {
		chg = false;
		qc = 0;
		i = 0;
		ii = 0;
		d = 0;
		val = 0;
		for (iii = 0; a[iii] != '\0'; iii++){
			if (i == 0 && a[iii] == ' '){chg = true;}
			else if (i == 0 && a[iii] == '\t'){chg = true;}
			else {
				b[i] = a[iii];
				i++;
				if (a[iii] == ' ' || a[iii] == '\t'){
				}
				else {
					if (a[iii] == '\"' && i >1 && qc == 0) {qc = i;}
					else if (a[iii] == '\"' && i >1) {qc = -1;}
					else if (a[iii] != '\"' && i == 1) {qc = -1;}
					if (a[iii] == '0' || a[iii] == '1' || a[iii] == '2' || a[iii] == '3' || a[iii] == '4' || a[iii] == '5' || a[iii] == '6' || a[iii] == '7' || a[iii] == '8' || a[iii] == '9') {d++; val = val*10 + (a[iii] - '0');}
					ii = i; 
				}
			
			}
		}
		if (ii != i){chg = true;}
		if (ii == qc && ii > 0){b[0] = ' '; b[ii-1] = '\0'; chg = true;}
		else {b[ii] = '\0'; osl = ii;}
		for (iii = 0; b[iii] != '\0'; iii++){
			a[iii] = b[iii];
		}
		a[iii] = b[iii];
	} while (chg);
	
	
	if (osl < 1){return "blank";}
	else if (d == osl) {return "integer";}
	if (d == 0) {return "string";}

	
	//Get fractions, decimals, and dates

	qc = 0; qcc = 0; i = 0;ii = 0;d = 0; //out.v = 0; out.w = 0; osl = 0;
	for (iii = 0; a[iii] != '\0'; iii++){
		if (a[iii] == '/'){ii = i; qc++;}
		else if (a[iii] == '.'){ii = i; qcc++;}
		else {
			b[i] = a[iii];
			i++;
			if (a[iii] == '0' || a[iii] == '1' || a[iii] == '2' || a[iii] == '3' || a[iii] == '4' || a[iii] == '5' || a[iii] == '6' || a[iii] == '7' || a[iii] == '8' || a[iii] == '9') {
				/*if (qc == 0 && qcc == 0) {out.v = out.v*10 + (a[iii] - '0');}
				else if (qc == 0 && out.v < 100000000) {out.v = out.v*10 + (a[iii] - '0'); out.w--;}
				else if (qc == 1) {out.w = out.w*10 + (a[iii] - '0');}
				else if (qc == 2) {osl = osl*10 + (a[iii] - '0');}*/
				d++;
			}
		}
	}
	
	if (qc == 1 && qcc == 0 && d == i && ii < i && ii > 0) {if (out.w != 1) {out.t = 'R';}; return "fraction";}
	else if (qc == 0 && qcc == 1 && d == i) {out.t = 'F';return "decimal";}
	else if (qc == 2 && qcc == 0 && d == i && ii < i && ii > 0) {
		//if (out.v > 0 && out.w > 0 && osl > 0){
			return "date";//createDate(out.v,out.w,osl);
		//}		
	}
	b[i] = '\0';
	//out.v = 0; out.w = 1;
	//return out;
	return "string";

	
	/*
    input_str = input_str.trim().toLowerCase();
	head_str = head_str.trim().toLowerCase();
	if (input_str.length == 0) {
		return 'Blank';
	}
	else if (parseInt(input_str).toString() == input_str){
		if (head_str.indexOf('zip') == 0 && parseInt(input_str) <10000 && parseInt(input_str) > 0) {
			return 'Zip';
		}
		return 'Int';
	}
	else if (parseInt(input_str.replace('.','')).toString() == input_str.replace('.','')){
		if (head_str.indexOf('lat') == 0 && parseFloat(input_str) < 200 && parseFloat(input_str) > -200) {
			if (head_str.length < 6 || head_str.indexOf('latitude') == 0){
				return 'Lat';
			}
		}
		else if (head_str.indexOf('lon') == 0 && parseFloat(input_str) < 200 && parseFloat(input_str) > -200) {
			if (head_str.length < 6 || head_str.indexOf('longitude') == 0){
				return 'Lon';
			}
		}
		return 'Num';
	}
	else if (isDate(input_str)){
		return 'Date';//+isDate(input_str);
	}
	else if (parseInt(input_str.replace('/','')).toString() == input_str.replace('/','')){
		return 'Num';
	}
	else if (parseInt(input_str.replace('/','').replace('.','').replace('%','')).toString() == input_str.replace('/','').replace('.','').replace('%','')){
		return 'Percent';
	}
	else if (parseInt(input_str.replace('-','')).toString() == input_str.replace('-','')){
		if (input_str.length == 10 && input_str.indexOf('-') == 5) {
			return 'Zip';
		}
		else if (input_str.length == 8 && input_str.indexOf('-') == 3) {
			return 'Phone';
		}
	}
	else if (parseInt(input_str.replace('-','').replace('-','')).toString() == input_str.replace('-','').replace('-','')){
		if (input_str.length == 12 && input_str.indexOf('-') == 3) {
			return 'Phone';
		}
	}
	else if (input_str.indexOf('www.') > -1 || input_str.indexOf('http') > -1 || (input_str.indexOf('.com') > -1 && input_str.indexOf('@') == -1)){
		return 'Link';
	}
	else if ( (input_str.indexOf('.com') > -1 || input_str.indexOf('.edu') > -1 || input_str.indexOf('.org') > -1) && input_str.indexOf('@') > -1){
		return 'Email';
	}
	else if ( (input_str.indexOf('.com') == -1 && input_str.indexOf('.edu') == -1 && input_str.indexOf('.org') == -1) && input_str.indexOf('@') == 0){
		return 'Twitter';
	}
	*/
	
}



}