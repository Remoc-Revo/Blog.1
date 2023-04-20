
export default function linearCongruentialGenerator(x){
    const a = 110359034255;
    const b = 124355;
    return (a * x + b) % 256;
}