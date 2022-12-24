const checkMillionDollarIdea = (req, res, next) => {
    const numWeeks = Number(req.body.numWeeks);
    const weeklyRevenue = Number(req.body.weeklyRevenue);

    const worth = numWeeks * weeklyRevenue;
    
    if (!numWeeks || !weeklyRevenue || worth < 1000000) {
        return res.status(400).send('Value of the idea is under $1,000,000')
    }
    next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
