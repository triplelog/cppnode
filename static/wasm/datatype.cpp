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

char* int_sqrt(char* x) {
  return x;
}

}