const jwt = require('jsonwebtoken');/* jsonwebtoken plugin enabling to manage tokens */

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];/* look for the token located after the space in header 'authorization' */
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;/* get the userId linked to the token */
    if (req.body.userId && req.body.userId !== userId) {/* if the request has a userId and if this userId does not match the userId linked to the token  */
      throw 'Invalid user ID';
    } else {
      next();/* go to next function if valid user ID */
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};