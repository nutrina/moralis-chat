
const logger = Moralis.Cloud.getLogger();

async function hasUserPermission(user) {
    const query = new Moralis.Query("EthBalance");
    query.equalTo("address", user.get("ethAddress"));
    const results = await query.find();

    if (results.length > 0) {
        const r = results[0];
        const balance = r.get("balance");
        if(balance && balance > 0) {
            return true;
        }
    }

    return false;
}

Moralis.Cloud.define("getChatMesages", async (request) => {
    const hasPermission = await hasUserPermission(request.user);
    let results = undefined;
    if (hasPermission) {
        const query = new Moralis.Query("ChatMessage");
        query.equalTo("chatId", request.params.chatId);
        results = await query.find();
    }

    const groupQuery = new Moralis.Query("ChatGroup");
    groupQuery.equalTo("objectId", request.params.chatId);
    const groups = await groupQuery.find();
    let groupName = undefined;
    let isValid = false;
    if(groups.length > 0) {
        groupName = groups[0].get("name");
        isValid = true;
    } 

    return { hasPermission, results, groupName, isValid };
});

Moralis.Cloud.beforeSubscribe('ChatMessage', request => {
    const query = request.query.toJSON();
    logger.info("beforeSubscribe request " + request);
    logger.info("beforeSubscribe json " + request.query.toJSON().toString());
    const chatId = query["where"]["chatId"];
    logger.info("beforeSubscribe request " + chatId);
});
