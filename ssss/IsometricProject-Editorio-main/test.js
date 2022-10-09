// let m = [];
// for (let i = 0; i <= 10; i++) {
//     let row = []
//     for (let j = 0; j <= 10; j++) {
//         row[j] = j;
//     };
//     m[i] = row;
// };
// let rm = []
// for (let i = 0; i < m.length; i++) {
//     let r = []
//     for (let j = 0; j < m[i].length; j++) {
//         if (i == j) {
//             r[j] = m[i].splice(j,1)[0]
//         };
//     };
//     rm[i] =r
//     console.log(m[i])
// };
// 
// console.log(rm[1])

let m = [
    {
        name: "Ivan",
        age: 23
    },
    {
        name: "Dimo",
        age: 24
    },
    {
        name: "Petar",
        age: 19
    },
]
let clone = JSON.parse(JSON.stringify(m))
m[0].name = "Dimitar"
console.table(clone)