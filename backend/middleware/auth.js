import jwt from 'jsonwebtoken';


const auth = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const isCustomeAuth = token.length < 500;

        let decodeData;

        if(token && isCustomeAuth){
            decodeData = jwt.verify(token,'shashank');
            req.userId = decodeData?.id;
        } else {
            decodeData = jwt.decode(token);
            req.userId = decodeData?.sub;
        }

        next()

    } catch(error){
        console.log(error);
    }
}

export default auth;