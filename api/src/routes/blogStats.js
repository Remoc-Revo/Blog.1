const {queryDb} = require('../global');

exports.getStats = async(req,res)=>{
    let stats = {};


    let viewsToday =  await queryDb(`SELECT COUNT(*) as count  FROM PAGEVIEW WHERE DATE(timestamp) = CURDATE()`)
    viewsToday = viewsToday[0].count;

    let  viewsLast7Days =  await queryDb(`SELECT COUNT(*) as count FROM PAGEVIEW 
                                            WHERE DATE(timestamp) >= CURDATE() - INTERVAL 7 DAY`)
    viewsLast7Days = viewsLast7Days[0].count;

    let  visitorsToday =  await queryDb(`SELECT COUNT(*) as count FROM VISITOR WHERE DATE(timestamp) = CURDATE()`)
    visitorsToday = visitorsToday[0].count;

    let visitorsLast7Days =  await queryDb(`SELECT COUNT(*) as count FROM VISITOR 
                                              WHERE DATE(timestamp) >= CURDATE() - INTERVAL 7 DAY`)
    visitorsLast7Days = visitorsLast7Days[0].count;

    console.log("page views",viewsToday,"7days",viewsLast7Days, "visitors",visitorsToday, "last7days",visitorsLast7Days);


    return res.status(200).json({
        statsToday: {viewsToday, visitorsToday},
        statsLast7Days: {viewsLast7Days,visitorsLast7Days}
    })
}