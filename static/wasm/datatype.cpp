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
	
	char *str = "xxxxx"; int i = 0; int ii;
	char *out = str;
	char * t;
	bool chg = true;
	do {
		chg = false;
		for (t = x; *t != '\0'; t++){
			if (i == 0 && *t == ' '){chg = true;}
			else if (i == 0 && *t == '\t'){chg = true;}
			else {
				out[i] = *t;
				i++;
				if (*t == ' ' || *t == '\t'){
				}
				else {
					ii = i;
				}
			
			}
		}
		if (ii != i){chg = true;}
		out[ii] = '\0';
		x = out;
		out = str;
	} while (chg);
	return x;
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