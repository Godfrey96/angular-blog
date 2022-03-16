// import expressJwt from 'express-jwt'

// const authJwt = () => {
//     const secret = process.env.JWT_SECRET;
//     const api = process.env.API_URL;
//     return expressJwt({
//         secret,
//         algorithms: ['HS256'],
//         isRevoked: isRevoked
//     }).unless({
//         path: [
//             { url: /\/api\/\/posts(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
//             { url: /\/api\/\/categories(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
//             { url: /\/api\/v1\/users(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
//             `${api}/users/login`,
//             `${api}/users`
//             // { url: /(.*)/ }
//         ]
//     })
// }

// async function isRevoked(req, payload, done) {
//     if (!payload.isAdmin) {
//         done(null, true)
//     }

//     done();
// }

// export { authJwt }