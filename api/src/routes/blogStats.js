const {queryDb} = require('../global');

exports.getStats = async(req,res)=>{
    let stats = {};


    try{
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


        let commentsToday = await queryDb(`
            SELECT COUNT(*) as count
            FROM COMMENT 
            WHERE DATE(dateAdded) = CURDATE()
                AND parentCommentId is NULL        
        `)
        commentsToday = commentsToday[0].count;

        let commentsLast7Days = await queryDb(`
            SELECT COUNT(*) as count
            FROM COMMENT 
            WHERE DATE(dateAdded) >= CURDATE() - INTERVAL 7 DAY
                AND parentCommentId is NULL        
        `)
        commentsLast7Days = commentsLast7Days[0].count;

        let likesToday = await queryDb(
            'SELECT COUNT(*) as count FROM `LIKE` \
             WHERE DATE(date) = CURDATE() \
                AND commentId is NULL \
                AND VALUE = 1',
        )
        likesToday = likesToday[0].count;

        let likesLast7Days = await queryDb(
            'SELECT COUNT(*) as count FROM `LIKE` \
             WHERE DATE(date) >= CURDATE() - INTERVAL 7 DAY \
                AND commentId is NULL \
                AND VALUE = 1',
        )
        likesLast7Days = likesLast7Days[0].count;

        console.log("page views",viewsToday,"7days",viewsLast7Days, "visitors",visitorsToday, "last7days",visitorsLast7Days);


        return res.status(200).json({
            statsToday: {viewsToday, visitorsToday,likesToday,commentsToday},
            statsLast7Days: {viewsLast7Days,visitorsLast7Days,likesLast7Days, commentsLast7Days}
        })
    }catch(err){
        console.log("Error fetching stats", err);
    }
}