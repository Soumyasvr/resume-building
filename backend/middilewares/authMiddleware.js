

// const protect = (req, res, next) => {
//     const token = req.headers.authorization;
//     if(!token){
//         return res.status(401).json({message: "Not authorized, no token"});
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         return res.status(401).json({message: "Not authorized, invalid token"});
//     }
// }

// export default protect;

import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("VERIFY ERROR:", error.message);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export default protect;