let m = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25],
]
m.forEach(x=>{
    x.forEach(y=>y/=10)
})
console.log(...m)
//m.forEach(row => row.reverse())
// function getDiagonals(m) {
//     var s, x, y, d,
//         o = [];
//     for (s = 0; s < m.length; s++) {
//         d = [];
//         for (y = s, x = 0; y >= 0; y--, x++)
//             d.push(m[y][x]);
//         o.push(d);
//     }
//     for (s = 1; s < m[0].length; s++) {
//         d = [];
//         for (y = m.length - 1, x = s; x < m[0].length; y--, x++)
//             d.push(m[y][x]);
//         o.push(d);
//     }
//     return o;
// }
// 
// var output = getDiagonals(m);
// output.forEach(x => {
//     console.log(x)
// })