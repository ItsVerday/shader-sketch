@nomangle PI map

const float PI = 3.1415926535897932384626433832795;

float map(float value, float a1, float a2, float b1, float b2) {
    return (value - a1) / (a2 - a1) * (b2 - b1) + b1;
}