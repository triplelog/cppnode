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
	
	char *str = "xxxxxxxxxx"; int i = 0; int ii; int qc; int osl;
	char *out = str;
	char * t;
	bool chg = true;
	int d;
	//Trim whitespace and quotation marks
	do {
		chg = false;
		qc = 0;
		i = 0;
		ii = 0;
		d = 0;
		for (t = x; *t != '\0'; t++){
			if (i == 0 && *t == ' '){chg = true;}
			else if (i == 0 && *t == '\t'){chg = true;}
			else {
				out[i] = *t;
				i++;
				if (*t == ' ' || *t == '\t'){
				}
				else {
					if (*t == '\"' && i >1 && qc == 0) {qc = i;}
					else if (*t == '\"' && i >1) {qc = -1;}
					else if (*t != '\"' && i == 1) {qc = -1;}
					if (*t == '0' || *t == '1' || *t == '2' || *t == '3' || *t == '4' || *t == '5' || *t == '6' || *t == '7' || *t == '8' || *t == '9') {d++;}
					ii = i;
				}
			
			}
		}
		if (ii != i){chg = true;}
		if (ii == qc && ii > 0){out[0] = ' '; out[ii-1] = '\0'; chg = true;}
		else {out[ii] = '\0'; osl = ii;}
		x = out;
		out = str;
	} while (chg);
	
	
	if (osl < 1){return "blank";}
	else if (d == osl) {return "integer";}
	if (d == 0) {return "string";}
	
	//Get fractions
	chg = true;
	do {
		chg = false;
		qc = 0;
		i = 0;
		ii = 0;
		d = 0;
		for (t = x; *t != '\0'; t++){
			if (i > 0 && *t == '/'){ii = i;}
			else {
				out[i] = *t;
				i++;
				if (*t == '0' || *t == '1' || *t == '2' || *t == '3' || *t == '4' || *t == '5' || *t == '6' || *t == '7' || *t == '8' || *t == '9') {d++;}
			}
		}
		

	} while (chg);
	
	if (ii > 0) {return "fraction";}
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