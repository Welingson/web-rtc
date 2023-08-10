import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send({ error: 'Token not provided' })
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Invalid token format' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
        if (err) return res.status(401).send({ error: 'Invalid token' })

        next();

    })
}

